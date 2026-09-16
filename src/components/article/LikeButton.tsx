"use client";

import { useCallback, useEffect, useState } from "react";
import { FaGithub, FaHeart } from "react-icons/fa";
import {
  completeOAuthRedirect,
  fetchCurrentUser,
  findIssue,
  getStoredToken,
  github,
  GithubIssue,
  loginWithGitHub,
} from "src/components/article/github";
import { useI18n } from "src/i18n";

interface Props {
  articleId: string;
}

interface GithubReaction {
  id: number;
  content: string;
  user: { login: string } | null;
}

// The reactions endpoints accept the standard v3 JSON media type on current
// GitHub API versions; issue search results include the `reactions` summary.
export const LikeButton = ({ articleId }: Props) => {
  const [token, setToken] = useState<string>();
  const [issue, setIssue] = useState<GithubIssue | null>();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [myReactionId, setMyReactionId] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const i18n = useI18n();

  const load = useCallback(
    async (accessToken?: string) => {
      setLoading(true);
      setError(false);
      try {
        const found = await findIssue(articleId, accessToken);
        setIssue(found);
        // The +1 count comes straight from the issue payload — no need to
        // scan comments, regardless of how many comments the issue has.
        setCount(found?.reactions?.["+1"] ?? 0);
        if (found && accessToken) {
          // GitHub guarantees one reaction of each type per user; check the
          // reaction list to learn whether the current user already liked.
          const reactions = await github<GithubReaction[]>(
            `/issues/${found.number}/reactions?per_page=100`,
            undefined,
            accessToken,
          );
          const me = await fetchCurrentUser(accessToken);
          const mine = reactions.find((r) => r.content === "+1" && r.user?.login === me.login);
          setLiked(!!mine);
          setMyReactionId(mine?.id);
        } else {
          setLiked(false);
          setMyReactionId(undefined);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [articleId],
  );

  // Restore token and complete the OAuth redirect if we came back from GitHub.
  useEffect(() => {
    const stored = getStoredToken();
    if (stored) {
      setToken(stored);
      void load(stored);
      return;
    }
    void completeOAuthRedirect()
      .then((exchanged) => {
        if (exchanged) {
          setToken(exchanged);
          void load(exchanged);
        } else {
          void load();
        }
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [load]);

  const like = useCallback(async (accessToken: string, target: GithubIssue) => {
    setSubmitting(true);
    setError(false);
    try {
      const created = await github<GithubReaction>(
        `/issues/${target.number}/reactions`,
        { method: "POST", body: JSON.stringify({ content: "+1" }) },
        accessToken,
      );
      setLiked(true);
      setMyReactionId(created.id);
      setCount((c) => c + 1);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }, []);

  const unlike = useCallback(
    async (accessToken: string, target: GithubIssue) => {
      if (myReactionId === undefined) return;
      setSubmitting(true);
      setError(false);
      try {
        await github(
          `/issues/${target.number}/reactions/${myReactionId}`,
          { method: "DELETE" },
          accessToken,
        );
        setLiked(false);
        setMyReactionId(undefined);
        setCount((c) => Math.max(0, c - 1));
      } catch {
        setError(true);
      } finally {
        setSubmitting(false);
      }
    },
    [myReactionId],
  );

  const login = () => {
    // Remember intent so the like can complete after the OAuth round-trip.
    window.localStorage.setItem(`like_intent:${articleId}`, "1");
    loginWithGitHub();
  };

  // Complete a pending like after returning from the OAuth redirect.
  useEffect(() => {
    if (!token || !issue || loading) return;
    if (window.localStorage.getItem(`like_intent:${articleId}`) !== "1") return;
    window.localStorage.removeItem(`like_intent:${articleId}`);
    if (!liked) void like(token, issue);
  }, [token, issue, loading, liked, articleId, like]);

  const onClick = () => {
    if (!token) {
      login();
      return;
    }
    if (!issue || submitting) return;
    void (liked ? unlike(token, issue) : like(token, issue));
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={`btn ${liked ? "btn-secondary" : "btn-outline"}`}
        onClick={onClick}
        disabled={
          loading ||
          submitting ||
          (token !== undefined && !issue) ||
          (liked && myReactionId === undefined)
        }
        title={
          !token
            ? i18n.translateToString("likes.loginTooltip")
            : !issue
              ? i18n.translateToString("likes.noIssue")
              : liked
                ? i18n.translateToString("likes.unlikeTooltip")
                : undefined
        }
      >
        {token ? <FaHeart /> : <FaGithub />}
        {loading
          ? i18n.translateToString("likes.loading")
          : submitting
            ? i18n.translateToString("likes.submitting")
            : liked
              ? i18n.translateToString("likes.liked")
              : i18n.translateToString("likes.like")}
        <span className="badge badge-sm">{count}</span>
      </button>
      {error ? (
        <span className="text-error text-sm">{i18n.translateToString("likes.error")}</span>
      ) : undefined}
    </div>
  );
};
