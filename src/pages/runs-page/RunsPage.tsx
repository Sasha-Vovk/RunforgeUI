import { useCallback, useEffect, useMemo, useState } from "react";
import {
  STATUS_FILTERS,
  type LoadState,
  type Run,
  type RunStatus,
} from "@/shared";
import { fetchRuns } from "../../server/mockService";
import { Filters } from "../../components/filters/Filters";
import { List } from "../../components/list/List";
import { Drawer } from "../../components/drawer/Drawer";
import { LoadingSkeleton } from "../../components/loading-skeleton/LoadingSkeleton";
import styles from "./RunsPage.module.css";

export function RunsPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RunStatus | "all">("all");
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);

  const load = useCallback(async () => {
    setLoadState("loading");
    try {
      const data = await fetchRuns();
      setRuns(data);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);

  const filteredRuns = useMemo(() => {
    const q = search.trim().toLowerCase();

    return runs.filter((run) => {
      if (statusFilter !== "all" && run.status !== statusFilter) return false;
      if (!q) return true;

      return (
        run.name.toLowerCase().includes(q) ||
        run.repository.toLowerCase().includes(q)
      );
    });
  }, [runs, search, statusFilter]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("all");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Project / web-platform</p>
          <h1 className={styles.title}>Runs</h1>
        </div>
        <span className={styles.livePill}>
          <span className={styles.dot}>●</span> Live
        </span>
      </header>

      <Filters
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        options={STATUS_FILTERS}
      />

      <div className={styles.content}>
        {loadState === "loading" && <LoadingSkeleton />}

        {loadState === "error" && (
          <div className={styles.state} role="alert">
            <h2>Could not load runs</h2>
            <p>Check your connection and try again.</p>
            <button type="button" className={styles.primaryBtn} onClick={load}>
              Retry
            </button>
          </div>
        )}

        {loadState === "ready" && filteredRuns.length === 0 && (
          <div className={styles.state}>
            <h2>No runs found</h2>
            <p>Try a different search query or reset the filters.</p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={resetFilters}
            >
              Reset filters
            </button>
          </div>
        )}

        {loadState === "ready" && filteredRuns.length > 0 && (
          <List runs={filteredRuns} onSelect={setSelectedRun} />
        )}
      </div>

      {selectedRun && (
        <Drawer run={selectedRun} onClose={() => setSelectedRun(null)} />
      )}
    </section>
  );
}
