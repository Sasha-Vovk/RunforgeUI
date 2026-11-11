import {
  formatDateTime,
  formatDuration,
  pluralize,
  type Run,
  type SortField,
  type SortState,
} from "@/shared";
import { StatusBadge } from "../status-badge/StatusBadge";
import styles from "./List.module.css";

type Props = {
  runs: Run[];
  sort: SortState;
  onSelect: (run: Run) => void;
  onSortChange: (field: SortField) => void;
};

const RunRow = ({
  run,
  onSelect,
}: {
  run: Run;
  onSelect: (run: Run) => void;
}) => {
  return (
    <button
      type="button"
      className={styles.row}
      onClick={() => onSelect(run)}
      aria-label={`Open details for run ${run.name}`}
    >
      <span className={styles.cell} data-label="Run">
        <span className={styles.name}>{run.name}</span>
      </span>
      <span className={styles.cell} data-label="Repository">
        {run.repository}
      </span>
      <span className={styles.cell} data-label="Branch">
        <code className={styles.branch}>{run.branch}</code>
      </span>
      <span className={styles.cell} data-label="Status">
        <StatusBadge status={run.status} />
      </span>
      <span className={styles.cell} data-label="Created">
        {formatDateTime(run.createdAt)}
      </span>
      <span className={styles.cell} data-label="Duration">
        {formatDuration(run.durationSeconds)}
      </span>
    </button>
  );
};

const SortHeader = ({
  field,
  label,
  sort,
  onSortChange,
}: {
  field: SortField;
  label: string;
  sort: SortState;
  onSortChange: (field: SortField) => void;
}) => {
  const active = sort.field === field;
  const arrow = active ? (sort.direction === "asc" ? "↑" : "↓") : "↕";

  return (
    <button
      type="button"
      className={`${styles.headerBtn} ${active ? styles.headerBtnActive : ""}`}
      onClick={() => onSortChange(field)}
      aria-label={
        active
          ? `Sort by ${label}, currently ${sort.direction === "asc" ? "ascending" : "descending"}`
          : `Sort by ${label}`
      }
    >
      {label}
      <span className={styles.sortIndicator} aria-hidden="true">
        {arrow}
      </span>
    </button>
  );
};

export const List = ({ runs, sort, onSelect, onSortChange }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.meta}>
        {runs.length} {pluralize(runs.length, "run", "runs")} found
      </div>

      <div className={styles.header}>
        <span>Run</span>
        <span>Repository</span>
        <span>Branch</span>
        <span>Status</span>
        <SortHeader
          field="createdAt"
          label="Created"
          sort={sort}
          onSortChange={onSortChange}
        />
        <SortHeader
          field="durationSeconds"
          label="Duration"
          sort={sort}
          onSortChange={onSortChange}
        />
      </div>

      <ul className={styles.list}>
        {runs.map((run) => (
          <li key={run.id}>
            <RunRow run={run} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </div>
  );
};
