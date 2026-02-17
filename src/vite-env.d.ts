/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly PACT_PROVIDER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
