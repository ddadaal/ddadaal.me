import React from "react";
import { Menu } from "grommet";

interface Props {
  languageNames: {[key: string]: string}
  changeLanguage(id: string): Promise<void>;
  currentLanguage: string;
}

const LanguageSelector: React.FC<Props> = ({
  languageNames,
  changeLanguage,
  currentLanguage,
}) => {
  return (
    <Menu
      label={currentLanguage}
      items={Object.keys(languageNames).map((id) => ({
        label: languageNames[id],
        onClick: () => changeLanguage(id),
      }))}
    />

  );
};

export default LanguageSelector;
