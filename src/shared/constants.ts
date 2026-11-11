import type {
  RunStatus,
  RunsUrlState,
  SortDirection,
  SortField,
} from "./types";

export const PRIMARY_NAV = [
  "Runs",
  "Projects",
  "Devboxes",
  "Previews",
  "Snapshots",
];

export const LABELS = {
  queued: "Queued",
  running: "Running",
  succeeded: "Succeeded",
  failed: "Failed",
};

export const STATUS_FILTERS: Array<{
  value: RunStatus | "all";
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "queued", label: "Queued" },
  { value: "running", label: "Running" },
  { value: "succeeded", label: "Succeeded" },
  { value: "failed", label: "Failed" },
];

export const DEFAULT_RUNS_URL_STATE: RunsUrlState = {
  search: "",
  status: "all",
  sort: { field: "createdAt", direction: "desc" },
};

export const STATUS_VALUES: Array<RunStatus | "all"> = [
  "all",
  "queued",
  "running",
  "succeeded",
  "failed",
];

export const SORT_FIELDS: SortField[] = ["createdAt", "durationSeconds"];
export const SORT_DIRS: SortDirection[] = ["asc", "desc"];
