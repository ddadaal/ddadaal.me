import classNames from "classnames";
import Link from "next/link";
import { FaBookOpen, FaFile, FaMale, FaRss, FaSlideshare } from "react-icons/fa";
import { Background } from "src/app/Background";
import { ArticleLink } from "src/components/article/LocalizedArticleLink";
import { Contacts } from "src/components/Contacts";
import { readArticlesCached } from "src/data/articles";
import { Localized } from "src/i18n";
import { LastUpdateTime } from "src/layout/LastUpdateTime";
import { serverTime } from "src/utils/serverTime";

export default async function Page() {

  const articles = await readArticlesCached();

  return (
    <main className="min-h-screen relative">
      <Background />
      <div
        className={classNames("absolute", "text-primary-content",
          "h-full w-full", "flex flex-col items-center justify-center", "space-y-4", "animate-slide-up",
          "-translate-y-12",
        )}
      >
        <h1 className="text-5xl">
          <Localized id="homepage.hello" />
        </h1>
        <h2>
          <Localized id="homepage.from" />
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link className="btn btn-sm btn-accent" href="/articles">
            <FaBookOpen />
            <Localized id="homepage.links.articles" args={[articles.length]} />
          </Link>
          <Link className="btn btn-sm btn-accent" href="/rss">
            <FaRss />
            <Localized id="homepage.links.rss" />
          </Link>
          <ArticleLink className="btn btn-sm btn-accent" baseUrl="/resume">
            <FaFile />
            <Localized id="homepage.links.resume" />
          </ArticleLink>
          <Link className="btn btn-sm btn-accent" href="/slides">
            <FaSlideshare />
            <Localized id="homepage.links.slides" />
          </Link>
          <Link className="btn btn-sm btn-accent" href="/about/me">
            <FaMale />
            <Localized id="homepage.links.aboutMe" />
          </Link>
        </div>
        <div>
          <Contacts size={2} />
        </div>
        <div>
          <LastUpdateTime time={serverTime.toISO()!} />
        </div>
      </div>
    </main>
  );
}

