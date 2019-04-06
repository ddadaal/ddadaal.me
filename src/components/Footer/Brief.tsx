import React from "react";
import LocalizedString from "@/i18n/LocalizedString";
import { Link } from "gatsby";
import lang from "@/i18n/lang";
import { MetadataStore } from "@/stores/MetadataStore";
import { useStore } from "simstate";
import { I18nStore } from "@/stores/I18nStore";
import Contacts from "@/components/Contacts";

const root = lang.footer;

export default function Brief() {

  const metadataStore = useStore(MetadataStore);
  const i18nStore = useStore(I18nStore);

  const aboutMePath = metadataStore.getNodeFromLang("about-me", i18nStore.language).path;

  return (
    <div className="footer-brief">

      <p>
        👨🏼‍💻 <LocalizedString id={root.codeBy} replacements={[
          <Link key={"me"} to={aboutMePath}>VicCrubs</Link>,
        ]} />
      </p>
      <p>
        📝 <LocalizedString id={root.license} replacements={[
          <a key="license" rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/">
            BY CC-SA 4.0
        </a>,
        ]} />

      </p>
      <div>
        <span id="contacts">📲 <LocalizedString id={root.contacts} /></span>
        <Contacts color="white" size={1.6} />
      </div>
    </div>
  );
}