import { useEffect, useState } from "react";
import {
  DEFAULT_RUNS_URL_STATE,
  SORT_DIRS,
  SORT_FIELDS,
  STATUS_VALUES,
  type RunStatus,
  type RunsUrlState,
  type SortDirection,
  type SortField,
} from "@/shared";

const readFromUrl = (): RunsUrlState => {
  const params = new URLSearchParams(window.location.search);

  const rawStatus = params.get("status");
  const rawField = params.get("sort");
  const rawDir = params.get("dir");

  return {
    search: params.get("q") ?? "",
    status: STATUS_VALUES.includes(rawStatus as RunStatus | "all")
      ? (rawStatus as RunStatus | "all")
      : DEFAULT_RUNS_URL_STATE.status,
    sort: {
      field: SORT_FIELDS.includes(rawField as SortField)
        ? (rawField as SortField)
        : DEFAULT_RUNS_URL_STATE.sort.field,
      direction: SORT_DIRS.includes(rawDir as SortDirection)
        ? (rawDir as SortDirection)
        : DEFAULT_RUNS_URL_STATE.sort.direction,
    },
  };
};

const buildUrl = (state: RunsUrlState): string => {
  const params = new URLSearchParams();

  if (state.search) params.set("q", state.search);
  if (state.status !== "all") params.set("status", state.status);
  if (state.sort.field !== "createdAt") params.set("sort", state.sort.field);
  if (state.sort.direction !== "desc") params.set("dir", state.sort.direction);

  const qs = params.toString();
  return qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
};

export const useRunsUrlState = () => {
  const [state, setState] = useState<RunsUrlState>(() => readFromUrl());

  useEffect(() => {
    window.history.replaceState(null, "", buildUrl(state));
  }, [state]);

  useEffect(() => {
    const onPop = () => setState(readFromUrl());
    window.addEventListener("popstate", onPop);

    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return [state, setState] as const;
};
