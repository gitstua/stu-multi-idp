import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig(function (_a) {
    var _b;
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    var appEnv = (_b = env.VITE_APP_ENV) !== null && _b !== void 0 ? _b : mode;
    var base = appEnv === "production" ? env.VITE_VITE_BASE_PATH || "/" : "/";
    return {
        plugins: [vue()],
        base: base,
    };
});
