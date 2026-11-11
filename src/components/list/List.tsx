import { formatDateTime, formatDuration, pluralize, type Run } from "@/shared";
import { StatusBadge } from "../status-badge/StatusBadge";
import styles from "./List.module.css";

type Props = {
  runs: Run[];
  onSelect: (run: Run) => void;
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

export const List = ({ runs, onSelect }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.meta}>
        {runs.length} {pluralize(runs.length, "run", "runs")} found
      </div>

      <div className={styles.header} aria-hidden="true">
        <span>Run</span>
        <span>Repository</span>
        <span>Branch</span>
        <span>Status</span>
        <span>Created</span>
        <span>Duration</span>
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
