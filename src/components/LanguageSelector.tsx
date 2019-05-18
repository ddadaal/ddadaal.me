import React from "react";
import { useDropdown, DropdownToggle, Dropdown, DropdownItem, DropdownHeader } from "@/vicui";
// import { DropdownToggle } from "reactstrap";

interface Props {
  allLanguages: { id: string; name: string }[];
  changeLanguage(id: string): void;
  currentLanguage: string;
  prompt: React.ReactNode;
}

export default function LanguageSelector({ allLanguages, changeLanguage, currentLanguage, prompt }: Props) {
  const [open, toggle] = useDropdown(false);
  return (
    <Dropdown trigger={
      <DropdownToggle width="116px" variant="primary" onClick={toggle}>{currentLanguage}</DropdownToggle>
    } open={open}>
      <DropdownHeader>{prompt}</DropdownHeader>
      {allLanguages.map((lang) => (
        <DropdownItem
          key={lang.id}
          onClick={() => changeLanguage(lang.id)}>
          {lang.name}
        </DropdownItem>
      ))}
    </Dropdown>
  )
}

// export default function LanguageSelector({ allLanguages, changeLanguage, currentLanguage, prompt }: Props) {
//   return (
//     <UncontrolledDropdown>
//       <DropdownToggle caret={true}>
//         {currentLanguage}
//       </DropdownToggle>
//       <DropdownMenu>
//         <DropdownItem header={true}>{prompt}</DropdownItem>
//         {allLanguages.map((lang) => (
//           <DropdownItem
//             key={lang.id}
//             onClick={() => changeLanguage(lang.id)}>
//             {lang.name}
//           </DropdownItem>
//         ))}
//       </DropdownMenu>
//     </UncontrolledDropdown>
//   );
// }
