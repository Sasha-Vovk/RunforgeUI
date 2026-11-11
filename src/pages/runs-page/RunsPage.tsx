import { useCallback, useEffect, useMemo, useState } from "react";
import {
  STATUS_FILTERS,
  useRunsUrlState,
  DEFAULT_RUNS_URL_STATE,
  type LoadState,
  type Run,
  type RunStatus,
  type SortField,
} from "@/shared";
import { fetchRuns } from "../../server/mockService";
import { Filters } from "../../components/filters/Filters";
import { List } from "../../components/list/List";
import { Drawer } from "../../components/drawer/Drawer";
import { LoadingSkeleton } from "../../components/loading-skeleton/LoadingSkeleton";
import styles from "./RunsPage.module.css";

export const RunsPage = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);

  const [urlState, setUrlState] = useRunsUrlState();
  const { search, status: statusFilter, sort } = urlState;

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

  const setSearch = useCallback(
    (value: string) => setUrlState((s) => ({ ...s, search: value })),
    [setUrlState],
  );

  const setStatusFilter = useCallback(
    (value: RunStatus | "all") => setUrlState((s) => ({ ...s, status: value })),
    [setUrlState],
  );

  const handleSortChange = useCallback(
    (field: SortField) =>
      setUrlState((s) => ({
        ...s,
        sort:
          s.sort.field === field
            ? {
                field,
                direction: s.sort.direction === "asc" ? "desc" : "asc",
              }
            : { field, direction: "desc" },
      })),
    [setUrlState],
  );

  const visibleRuns = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = runs.filter((run) => {
      if (statusFilter !== "all" && run.status !== statusFilter) return false;
      if (!q) return true;
      return (
        run.name.toLowerCase().includes(q) ||
        run.repository.toLowerCase().includes(q)
      );
    });

    const dir = sort.direction === "asc" ? 1 : -1;

    return [...filtered].sort((a, b) => {
      if (sort.field === "createdAt") {
        return (
          dir *
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        );
      }

      const av = a.durationSeconds;
      const bv = b.durationSeconds;
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return dir * (av - bv);
    });
  }, [runs, search, statusFilter, sort]);

  const resetFilters = useCallback(
    () => setUrlState(DEFAULT_RUNS_URL_STATE),
    [setUrlState],
  );

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

        {loadState === "ready" && visibleRuns.length === 0 && (
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

        {loadState === "ready" && visibleRuns.length > 0 && (
          <List
            runs={visibleRuns}
            sort={sort}
            onSelect={setSelectedRun}
            onSortChange={handleSortChange}
          />
        )}
      </div>

      {selectedRun && (
        <Drawer run={selectedRun} onClose={() => setSelectedRun(null)} />
      )}
    </section>
  );
};
