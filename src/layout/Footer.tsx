import { LocalizedArticleLink } from "src/components/article/LocalizedArticleLink";
import { Contacts } from "src/components/Contacts";
import { Localized } from "src/i18n";
import { LastUpdateTime } from "src/layout/LastUpdateTime";
import { RunningTime } from "src/layout/RunningTime";
import { serverTime } from "src/utils/serverTime";

const powerBys = [
  ["React", "https://reactjs.org/"],
  ["Next.js", "https://nextjs.org/"],
  ["GitHub Pages", "https://pages.github.com/"],
  ["TypeScript", "https://www.typescriptlang.org/"],
].map(([name, link]) => ({ name, link }));

const themedWiths = [
  ["daisyui", "https://daisyui.com/"],
  ["tailwind", "https://tailwindcss.com/"],
].map(([name, link]) => ({ name, link }));

const friends = [
  { name: "idealclover", description: "翠翠酱的个人网站", link: "https://idealclover.top" },
  { name: "Sephidator", description: "Sephidator的个人博客", link: "https://sephidator.xyz" },
  { name: "iznauy", description: "个人博客", link: "https://iznauy.github.io/" },
  { name: "Aironoria", description: "陈俊宇的个人博客", link: "https://aironoria.github.io" },
  { name: "forewing", description: "个人主页", link: "https://jbesu.com/" },
  { name: "Weiser", description: "个人主页", link: "https://weiser.fun" },
].map(({ name, link, description }) => ({
  name: `${name} - ${description}`,
  link,
}));

const FooterLink = ({ name, link }: { name: string; link: string }) => (
  <a className="link link-hover" target="_blank" href={link} rel="noreferrer">
    {name}
  </a>
);

export const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="footer sm:footer-horizontal py-6 max-w-7xl mx-auto px-4">
        <div className="space-y-1">
          <p>
            👨🏼‍💻&nbsp;
            <Localized
              id="footer.codeBy"
              args={[
                <LocalizedArticleLink
                  className="link link-hover"
                  key="about/me"
                  basePath="/about/me"
                >
                  ddadaal
                </LocalizedArticleLink>,
              ]}
            />
          </p>
          <p>
            📝
            <Localized
              id="footer.license"
              args={[
                <a
                  key="license"
                  rel="licene noreferrer"
                  target="_blank"
                  className="link"
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                >
                  CC BY-SA 4.0
                </a>,
              ]}
            />
          </p>
          <RunningTime serverStartTime={serverTime.toISO()} />
          <LastUpdateTime time={serverTime.toISO()} />
          <div>
            <p>
              📲 <Localized id="footer.contacts" />
            </p>
            <Contacts size={1.6} />
          </div>
          <p className="text-center">
            © {serverTime.year} | <Localized id="footer.madeWithLove" />
          </p>
        </div>
        <div>
          <span className="footer-title">
            🚀 <Localized id="footer.poweredBy" />
          </span>
          {powerBys.map((x) => (
            <FooterLink key={x.name} link={x.link} name={x.name} />
          ))}
        </div>
        <div>
          <span className="footer-title">
            🎨 <Localized id="footer.themedWith" />
          </span>
          {themedWiths.map((x) => (
            <FooterLink key={x.name} link={x.link} name={x.name} />
          ))}
        </div>
        <div>
          <span className="footer-title">
            🎓 <Localized id="footer.contacts" />
          </span>
          {friends.map((x) => (
            <FooterLink key={x.name} link={x.link} name={x.name} />
          ))}
        </div>
      </div>
    </footer>
  );
};
