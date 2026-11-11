import type { RunStatus } from "@/shared";
import styles from "./Filters.module.css";

type StatusOption = { value: RunStatus | "all"; label: string };

type Props = {
  search: string;
  status: RunStatus | "all";
  options: StatusOption[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: RunStatus | "all") => void;
};

export const Filters = ({
  search,
  status,
  options,
  onSearchChange,
  onStatusChange,
}: Props) => {
  return (
    <div className={styles.filters}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon} aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          className={styles.search}
          placeholder="Search by name or repository"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search runs"
        />
      </div>

      <div className={styles.pills} role="group" aria-label="Filter by status">
        {options.map((opt) => {
          const active = status === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              className={`${styles.pill} ${active ? styles.pillActive : ""}`}
              aria-pressed={active}
              onClick={() => onStatusChange(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
