import React from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

interface Props {
  allLanguages: { metadata: { id: string; name: string } }[];
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
            key={lang.metadata.id}
            onClick={() => changeLanguage(lang.metadata.id)}>
            {lang.metadata.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}

export default LanguageSelector;
