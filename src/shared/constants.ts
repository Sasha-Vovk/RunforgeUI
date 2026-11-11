import type { RunStatus } from "./types";

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
