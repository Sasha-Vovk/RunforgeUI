import { useState } from "react";
import { PRIMARY_NAV } from "@/shared";
import styles from "./Sidebar.module.css";

export const Sidebar = () => {
  const [isActive, setIsActive] = useState(PRIMARY_NAV[0]);

  const sideBarHandler = (item: string) => {
    setIsActive(item);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Workspace</div>
      <nav className={styles.navGroup} aria-label="Workspace">
        {PRIMARY_NAV.map((item) => (
          <button
            onClick={() => sideBarHandler(item)}
            key={item}
            type="button"
            className={`${styles.navItem} ${
              item === isActive ? styles.navItemActive : ""
            }`}
            aria-current={item === "Runs" ? "page" : undefined}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className={styles.navGroup}>
        <button type="button" className={styles.navItem}>
          Settings
        </button>
      </div>
    </aside>
  );
};
