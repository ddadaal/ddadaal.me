"use client";

import { useCallback, useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import {
  CommentableKind,
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
  kind?: CommentableKind;
}

type ReactionContent = "+1" | "-1" | "laugh" | "hooray" | "confused" | "heart" | "rocket" | "eyes";

interface GithubReaction {
  id: number;
  content: ReactionContent;
  user: { login: string } | null;
}

const reactionContents: ReactionContent[] = [
  "+1",
  "-1",
  "laugh",
  "hooray",
  "confused",
  "heart",
  "rocket",
  "eyes",
];

const reactionEmoji: Record<ReactionContent, string> = {
  "+1": "👍",
  "-1": "👎",
  laugh: "😄",
  hooray: "🎉",
  confused: "😕",
  heart: "❤️",
  rocket: "🚀",
  eyes: "👀",
};

type ReactionCounts = Record<ReactionContent, number>;
type MyReactionIds = Partial<Record<ReactionContent, number>>;

const emptyReactionCounts = (): ReactionCounts =>
  Object.fromEntries(reactionContents.map((content) => [content, 0])) as ReactionCounts;

export const LikeButton = ({ articleId, kind = "article" }: Props) => {
  const [token, setToken] = useState<string>();
  const [issue, setIssue] = useState<GithubIssue | null>();
  const [counts, setCounts] = useState<ReactionCounts>(emptyReactionCounts);
  const [myReactionIds, setMyReactionIds] = useState<MyReactionIds>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const i18n = useI18n();

  const load = useCallback(
    async (accessToken?: string) => {
      setLoading(true);
      setError(false);
      try {
        const found = await findIssue(articleId, accessToken, kind);
        setIssue(found);
        setCounts(
          Object.fromEntries(
            reactionContents.map((content) => [content, found?.reactions?.[content] ?? 0]),
          ) as ReactionCounts,
        );
        if (found && accessToken) {
          const [reactions, me] = await Promise.all([
            github<GithubReaction[]>(
              `/issues/${found.number}/reactions?per_page=100`,
              undefined,
              accessToken,
            ),
            fetchCurrentUser(accessToken),
          ]);
          setMyReactionIds(
            Object.fromEntries(
              reactions
                .filter((reaction) => reaction.user?.login === me.login)
                .map((reaction) => [reaction.content, reaction.id]),
            ),
          );
        } else {
          setMyReactionIds({});
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [articleId, kind],
  );

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

  const toggleReaction = useCallback(
    async (content: ReactionContent, accessToken: string, target: GithubIssue) => {
      setSubmitting(true);
      setError(false);
      try {
        const reactionId = myReactionIds[content];
        if (reactionId === undefined) {
          const created = await github<GithubReaction>(
            `/issues/${target.number}/reactions`,
            { method: "POST", body: JSON.stringify({ content }) },
            accessToken,
          );
          setMyReactionIds((current) => ({ ...current, [content]: created.id }));
          setCounts((current) => ({ ...current, [content]: current[content] + 1 }));
        } else {
          await github(
            `/issues/${target.number}/reactions/${reactionId}`,
            { method: "DELETE" },
            accessToken,
          );
          setMyReactionIds((current) => {
            const next = { ...current };
            delete next[content];
            return next;
          });
          setCounts((current) => ({ ...current, [content]: Math.max(0, current[content] - 1) }));
        }
      } catch {
        setError(true);
      } finally {
        setSubmitting(false);
      }
    },
    [myReactionIds],
  );

  const login = (content: ReactionContent) => {
    window.localStorage.setItem(`reaction_intent:${kind}:${articleId}`, content);
    loginWithGitHub();
  };

  useEffect(() => {
    if (!token || !issue || loading) return;
    const content = window.localStorage.getItem(
      `reaction_intent:${kind}:${articleId}`,
    ) as ReactionContent | null;
    if (!content || !reactionContents.includes(content)) return;
    window.localStorage.removeItem(`reaction_intent:${kind}:${articleId}`);
    void toggleReaction(content, token, issue);
  }, [token, issue, loading, articleId, kind, toggleReaction]);

  const onClick = (content: ReactionContent) => {
    if (!token) {
      login(content);
      return;
    }
    if (!issue || submitting) return;
    void toggleReaction(content, token, issue);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {reactionContents.map((content) => {
        const selected = myReactionIds[content] !== undefined;
        const label = i18n.translateToString(`reactions.names.${content}`);
        return (
          <button
            key={content}
            type="button"
            className={`btn btn-sm ${selected ? "btn-secondary" : "btn-outline"}`}
            onClick={() => onClick(content)}
            disabled={loading || submitting || (token !== undefined && !issue)}
            title={
              !token
                ? i18n.translateToString("reactions.loginTooltip")
                : !issue
                  ? i18n.translateToString("reactions.noIssue")
                  : i18n.translateToString(selected ? "reactions.remove" : "reactions.add", [label])
            }
            aria-label={i18n.translateToString(selected ? "reactions.remove" : "reactions.add", [
              label,
            ])}
          >
            <span aria-hidden>{reactionEmoji[content]}</span>
            <span className="badge badge-sm">{counts[content]}</span>
          </button>
        );
      })}
      {!token && <FaGithub aria-label={i18n.translateToString("reactions.githubLogin")} />}
      {error && (
        <span className="text-error text-sm">{i18n.translateToString("reactions.error")}</span>
      )}
    </div>
  );
};
