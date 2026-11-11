import { LABELS, type RunStatus } from "@/shared";
import styles from "./StatusBadge.module.css";

export const StatusBadge = ({ status }: { status: RunStatus }) => {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {LABELS[status]}
    </span>
  );
};
