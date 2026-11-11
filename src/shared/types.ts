export type RunStatus = "queued" | "running" | "succeeded" | "failed";

export type Run = {
  id: string;
  name: string;
  repository: string;
  branch: string;
  status: RunStatus;
  createdAt: string;
  durationSeconds?: number;
  logs: string[];
  result?: string;
};

export type LoadState = "loading" | "error" | "ready";
export type SortField = "createdAt" | "durationSeconds";
export type SortDirection = "asc" | "desc";
export type SortState = { field: SortField; direction: SortDirection };

export type RunsUrlState = {
  search: string;
  status: RunStatus | "all";
  sort: SortState;
};
