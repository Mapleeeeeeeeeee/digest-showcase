import { randomUUID } from "node:crypto";

const buildGlobal = globalThis as typeof globalThis & {
  digestBuildVersion?: string;
};

export const buildVersion = process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT ?? "1"}`
  : (buildGlobal.digestBuildVersion ??= randomUUID());
