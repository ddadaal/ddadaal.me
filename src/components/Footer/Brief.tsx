import React from "react";
import LocalizedString from "@/i18n/LocalizedString";
import { Link } from "gatsby";
import lang from "@/i18n/lang";
import MetadataStore from "@/stores/MetadataStore";
import { useStore } from "simstate";
import Contacts from "@/components/Contacts";
import { useArticleOfCurrentLang } from "@/stores/useArticleOfCurrentLang";

const root = lang.footer;

const Brief: React.FC = () => {

  const metadataStore = useStore(MetadataStore);

  const aboutMeLink = useArticleOfCurrentLang("about-me").path;

  return (
    <div className="footer-brief">

      <p>
        👨🏼‍💻 <LocalizedString id={root.codeBy} replacements={[
          <Link key={"me"} to={aboutMeLink}>VicCrubs</Link>,
        ]} />
      </p>
      <p>
        📝 <LocalizedString id={root.license} replacements={[
          <a key="license" rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/">
            CC BY-SA 4.0
          </a>,
        ]} />

      </p>
      <p>
        ⏲️ <LocalizedString id={lang.statistics.lastUpdated} />: <strong>{metadataStore.lastUpdated}</strong>

      </p>
      <div>
        <span id="contacts">📲 <LocalizedString id={root.contacts} /></span>
        <Contacts color="white" size={1.6} />
      </div>

    </div>
  );
}

export default Brief;
