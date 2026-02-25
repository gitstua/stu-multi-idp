import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initializeAuth } from "./auth/service";
import "./style.css";

async function bootstrap(): Promise<void> {
  await initializeAuth();

  const app = createApp(App);
  app.use(router);
  app.mount("#app");
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  // Render a hard failure message when required auth config is missing.
  document.body.innerHTML = `<pre style=\"padding:1rem;color:#b00020;white-space:pre-wrap;\">Startup failed: ${message}</pre>`;
});
