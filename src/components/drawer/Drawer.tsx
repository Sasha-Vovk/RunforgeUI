import { useEffect, useRef, useState } from "react";
import { formatDateTime, formatDuration, type Run } from "@/shared";
import { StatusBadge } from "../status-badge/StatusBadge";
import styles from "./Drawer.module.css";

type Props = {
  run: Run;
  onClose: () => void;
};

export const Drawer = ({ run, onClose }: Props) => {
  const [tab, setTab] = useState<"logs" | "result">("logs");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    setTab("logs");
  }, [run.id]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="run-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <p className={styles.eyebrow}>Run</p>
            <button
              ref={closeRef}
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close details"
            >
              ×
            </button>
          </div>
          <h2 id="run-details-title" className={styles.title}>
            {run.name}
          </h2>
          <div>
            <StatusBadge status={run.status} />
          </div>
        </header>

        <dl className={styles.meta}>
          <div>
            <dt>Repository</dt>
            <dd>{run.repository}</dd>
          </div>
          <div>
            <dt>Branch</dt>
            <dd>
              <code>{run.branch}</code>
            </dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{formatDateTime(run.createdAt)}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{formatDuration(run.durationSeconds)}</dd>
          </div>
          <div>
            <dt>ID</dt>
            <dd>
              <code>{run.id}</code>
            </dd>
          </div>
        </dl>

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "logs"}
            className={`${styles.tab} ${tab === "logs" ? styles.tabActive : ""}`}
            onClick={() => setTab("logs")}
          >
            Logs
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "result"}
            className={`${styles.tab} ${
              tab === "result" ? styles.tabActive : ""
            }`}
            onClick={() => setTab("result")}
            disabled={!run.result}
            title={run.result ? undefined : "Result not available"}
          >
            Result
          </button>
        </div>

        <div className={styles.tabPanel}>
          {tab === "logs" ? (
            run.logs.length > 0 ? (
              <pre className={styles.pre}>{run.logs.join("\n")}</pre>
            ) : (
              <p className={styles.empty}>No logs yet.</p>
            )
          ) : run.result ? (
            <pre className={styles.pre}>{run.result}</pre>
          ) : (
            <p className={styles.empty}>Result is not ready yet.</p>
          )}
        </div>
      </aside>
    </div>
  );
};
