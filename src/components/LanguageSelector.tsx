import * as React from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
interface Props {
  allLanguages: { id: string; name: string }[];
  changeLanguage(id: string): void;
  currentLanguage: string;
  prompt: React.ReactNode;
}

export default function LanguageSelector({ allLanguages, changeLanguage, currentLanguage: language, prompt }: Props) {
  return (
    <UncontrolledDropdown>
      <DropdownToggle caret={true}>
        {language}
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
