import React from "react";
import { LocalizedString } from "simstate-i18n";
import { Link } from "gatsby";
import { lang } from "@/i18n";
import MetadataStore from "@/stores/MetadataStore";
import { useStore } from "simstate";
import Contacts from "@/components/Contacts";
import { useArticleOfCurrentLang } from "@/stores/useArticleOfCurrentLang";
import { RunningTime } from "@/components/Footer/RunningTime";

const root = lang.footer;

const Brief: React.FC = () => {

  const metadataStore = useStore(MetadataStore);

  const aboutMeLink = useArticleOfCurrentLang("about-me").path;

  return (
    <div className="footer-brief">

      <p>
        👨🏼‍💻 (
        <LocalizedString
          id={root.codeBy}
          replacements={[
            <Link key={"me"} to={aboutMeLink}>ddadaal</Link>,
          ]}
        />)
      </p>
      <p>
        📝 <LocalizedString id={root.license} replacements={[
          <a key="license" rel="licene"
            href="https://creativecommons.org/licenses/by-sa/4.0/"
          >
            CC BY-SA 4.0
          </a>,
        ]} />

      </p>
      <p>
        ⏲️ <LocalizedString id={lang.statistics.lastUpdated} />:
        <strong>{metadataStore.siteMetadata.formattedLastUpdate}</strong>
      </p>
      {/* <p>
        📔 <LocalizedString id={lang.statistics.articleCount} replacements={[
          <strong key="articles">{allArticles.length}</strong>,
          <strong key="words">{totalWordsCount}</strong>,
        ]} />
      </p> */}
      <RunningTime />
      <div>
        <span id="contacts">📲 <LocalizedString id={root.contacts} /></span>
        <Contacts color="white" size={1.6} />
      </div>

    </div>
  );
};

export default Brief;
