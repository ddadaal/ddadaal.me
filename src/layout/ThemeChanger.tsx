"use client";

import classNames from "classnames";
import { FaAdjust } from "react-icons/fa";
import { useStore } from "simstate";
import { Localized, prefix } from "src/i18n";
import { themes, ThemeStore } from "src/utils/theme";

const root = prefix("themes.");

interface Props {
  btnClassName?: string;
}

export const ThemeChanger = ({ btnClassName }: Props) => {
  const themeStore = useStore(ThemeStore);

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className={classNames("btn", btnClassName)}>
        <FaAdjust />
        <span className="hidden sm:block">
          <Localized id={root(themeStore.theme)} />
        </span>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 bg-base-200 text-base-content shadow rounded-box min-w-max"
      >
        {
          themes.map((id) => (
            <li key={id}>
              <a
                className="justify-between"
                onClick={() => {
                  themeStore.setTheme(id);
                }}
              >
                <Localized id={root(id)} />
              </a>
            </li>

          ))
        }
      </ul>
    </div>
  );
};
