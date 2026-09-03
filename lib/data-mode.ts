export type LaceDataMode = "mock" | "live";

type DataModeEnv = {
  LACE_DATA_MODE?: string;
  NEXT_PUBLIC_DEMO_MODE?: string;
  NEXT_PUBLIC_SHOW_DEMO_USERS?: string;
};

export type DataModeConfig = {
  dataMode: LaceDataMode;
  allowMockData: boolean;
  allowDemoAccounts: boolean;
};

function normalizeDataMode(value: string | undefined): LaceDataMode {
  return value === "live" ? "live" : "mock";
}

function getProcessDataModeEnv(): DataModeEnv {
  return process.env as unknown as DataModeEnv;
}

export function resolveDataMode(env: DataModeEnv = getProcessDataModeEnv()): DataModeConfig {
  const dataMode = normalizeDataMode(env.LACE_DATA_MODE);
  const allowMockData = dataMode === "mock";
  return {
    dataMode,
    allowMockData,
    allowDemoAccounts: allowMockData && env.NEXT_PUBLIC_DEMO_MODE === "true",
  };
}

export function isLiveDataMode(env: DataModeEnv = getProcessDataModeEnv()) {
  return resolveDataMode(env).dataMode === "live";
}
