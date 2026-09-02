declare module "@/next.config.mjs" {
  const config: {
    headers?: () => Promise<
      Array<{
        source: string;
        headers: Array<{ key: string; value: string }>;
      }>
    >;
  };

  export default config;
}
