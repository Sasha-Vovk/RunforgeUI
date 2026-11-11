import styles from "./LoadingSkeleton.module.css";

export const LoadingSkeleton = () => {
  return (
    <ul className={styles.list} aria-busy="true" aria-live="polite">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className={styles.row}>
          <span className={styles.cell} data-label="Run">
            <span className={`${styles.bar} ${styles.nameBar}`} />
          </span>
          <span className={styles.cell} data-label="Repository">
            <span className={styles.bar} style={{ width: "70%" }} />
          </span>
          <span className={styles.cell} data-label="Branch">
            <span className={styles.bar} style={{ width: "55%" }} />
          </span>
          <span className={styles.cell} data-label="Status">
            <span className={styles.pill} />
          </span>
          <span className={styles.cell} data-label="Created">
            <span className={styles.bar} style={{ width: "80%" }} />
          </span>
          <span className={styles.cell} data-label="Duration">
            <span className={styles.bar} style={{ width: "50%" }} />
          </span>
        </li>
      ))}
    </ul>
  );
};
