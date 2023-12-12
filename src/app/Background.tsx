import classNames from "classnames";

import styles from "./background.module.css";

export const Background = () => {
  return (
    <div className={classNames(styles.area, "absolute", "top-0")}>
      <ul className={styles.circles}>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
};
