import React from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { languageIds } from "@/i18n";

interface Props {
  languageNames: {[key: string]: string}
  changeLanguage(id: string): Promise<void>;
  currentLanguage: string;
  prompt: React.ReactNode;
}

const LanguageSelector: React.FC<Props> = ({
  languageNames,
  changeLanguage,
  currentLanguage,
  prompt,
}) => {
  return (
    <UncontrolledDropdown>
      <DropdownToggle caret={true}>
        {currentLanguage}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header={true}>
          {prompt}
        </DropdownItem>
        {Object.keys(languageNames).map((id) => (
          <DropdownItem
            key={id}
            onClick={() => changeLanguage(id)}>
            {languageNames[id]}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}

export default LanguageSelector;
