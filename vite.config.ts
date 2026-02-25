import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const appEnv = env.VITE_APP_ENV ?? mode;
  const base = appEnv === "production" ? env.VITE_VITE_BASE_PATH || "/" : "/";

  return {
    plugins: [vue()],
    base,
  };
});
