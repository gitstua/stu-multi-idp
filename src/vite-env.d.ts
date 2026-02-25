/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: "development" | "production" | string;
  readonly VITE_APP_BASE_URL_DEV: string;
  readonly VITE_APP_BASE_URL_PROD: string;
  readonly VITE_VITE_BASE_PATH: string;
  readonly VITE_ENTRA_ORGA_TENANT_ID: string;
  readonly VITE_ENTRA_ORGA_CLIENT_ID: string;
  readonly VITE_ENTRA_ORGB_TENANT_ID: string;
  readonly VITE_ENTRA_ORGB_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
