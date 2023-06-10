"use client";

import classNames from "classnames";
import { useStore } from "simstate";
import { getLanguage, languages, Locale } from "src/i18n";
import { I18nStore } from "src/i18n/store";

interface Props {
  btnClassName?: string;
}

export const LanguageSwitcher = ({ btnClassName }: Props) => {

  const i18n = useStore(I18nStore);

  const language = getLanguage(i18n.i18n.currentLanguage.id);

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className={classNames("btn", btnClassName)}>
        <language.icon />
        <span className="hidden sm:block">
          {language.name}
        </span>
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 text-base-content">
        {
          Object.entries(languages).map(([id, info]) => (
            <li key={id}>
              <a
                className="justify-between"
                onClick={() => {
                  i18n.setLanguageById(id as Locale);
                }}
              >
                <info.icon />
                {info.name}
              </a>
            </li>
          ))
        }
      </ul>
    </div>
  );
};
