import { MOCK_DATA } from "./data";
import type { Run } from "../shared/types";

const DELAY_MS = import.meta.env.MODE === "test" ? 0 : 700;

const shouldFail = (): boolean => {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);

  return params.get("fail") === "1";
};

export const fetchRuns = (): Promise<Run[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) {
        reject(new Error("Mock service error"));

        return;
      }

      resolve(MOCK_DATA);
    }, DELAY_MS);
  });
};
