import React from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

interface Props {
  allLanguages: { id: string; name: string }[];
  changeLanguage(id: string): void;
  currentLanguage: string;
  prompt: React.ReactNode;
}

const LanguageSelector: React.FC<Props> = ({ allLanguages, changeLanguage, currentLanguage, prompt }) => {
  return (
    <UncontrolledDropdown>
      <DropdownToggle caret={true}>
        {currentLanguage}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header={true}>{prompt}</DropdownItem>
        {allLanguages.map((lang) => (
          <DropdownItem
            key={lang.id}
            onClick={() => changeLanguage(lang.id)}>
            {lang.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}

export default LanguageSelector;
