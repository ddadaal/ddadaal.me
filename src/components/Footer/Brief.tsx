import React from "react";
import LocalizedString from "@/i18n/LocalizedString";
import { Link } from "gatsby";
import lang from "@/i18n/lang";
import { MetadataStore } from "@/stores/MetadataStore";
import { useStore } from "simstate";
import { I18nStore } from "@/stores/I18nStore";
import Contacts from "@/components/Contacts";
import SeparatedRow from "@/components/Footer/SeparatedRow";

const root = lang.footer;

export default function Brief() {

  const metadataStore = useStore(MetadataStore);
  return (
    <div className="footer-brief">

      <p>
        👨🏼‍💻 <LocalizedString id={root.codeBy} replacements={[
          <Link key={"me"} to={"/about/me"}>VicCrubs</Link>,
        ]} />
      </p>
      <p>
        📝 <LocalizedString id={root.license} replacements={[
          <a key="license" rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/">
            BY CC-SA 4.0
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
