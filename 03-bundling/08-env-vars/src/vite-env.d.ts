/// <reference types="vite/client" />

// Only allow the variables declared in ImportMetaEnv (typos become errors).
interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

// We'll add here our environment variables. Remember all have string values.
interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_ENABLE_FEATURE_A: string;
}
