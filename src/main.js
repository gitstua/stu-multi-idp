import { initializeAuth, login, logout } from "./auth/service";
import { providerConfigs } from "./auth/config";
import { getAuthState, subscribeAuth } from "./store/auth";
import "./style.css";

const app = document.querySelector("#app");

function currentRoute() {
  const route = window.location.hash.replace(/^#/, "") || "/";
  return route.startsWith("/") ? route : `/${route}`;
}

function navigate(path) {
  window.location.hash = path;
}

function renderHome(root, state) {
  const signedInAs = state.activeAccount
    ? (state.activeAccount.name ?? state.activeAccount.username)
    : "Not signed in";
  const providerLabel = state.activeProvider ? providerConfigs[state.activeProvider].label : "None";

  root.innerHTML = `
    <section class="card">
      <h1>Dual Entra ID Login Demo</h1>
      <p>Authenticate with one of two Microsoft Entra tenants using MSAL browser PKCE.</p>
      <p><strong>Status:</strong> ${signedInAs}</p>
      <p><strong>Active provider:</strong> ${providerLabel}</p>
      <div class="actions">
        <button type="button" data-login="orga">Login with Org A</button>
        <button type="button" data-login="orgb">Login with Org B</button>
        ${state.isAuthenticated ? '<button type="button" class="danger" data-action="logout">Logout</button>' : ""}
      </div>
      ${state.isAuthenticated ? '<a href="#/profile">Go to Profile</a>' : ""}
    </section>
  `;

  root.querySelector('[data-login="orga"]')?.addEventListener("click", () => login("orga"));
  root.querySelector('[data-login="orgb"]')?.addEventListener("click", () => login("orgb"));
  root.querySelector('[data-action="logout"]')?.addEventListener("click", () => logout());
}

function renderProfile(root, state) {
  if (!state.activeAccount) {
    root.innerHTML = `
      <section class="card">
        <h1>Profile</h1>
        <p>No active account.</p>
        <a href="#/">Back to Home</a>
      </section>
    `;
    return;
  }

  const idTokenClaims = state.activeAccount.idTokenClaims || {};
  const rows = [
    ["name", state.activeAccount.name],
    ["username", state.activeAccount.username],
    ["tenant (tid)", idTokenClaims.tid],
    ["object id (oid)", idTokenClaims.oid],
    ["provider", state.activeProvider ? providerConfigs[state.activeProvider].label : undefined],
  ];

  const rowHtml = rows
    .map(([key, value]) => `<tr><th>${key}</th><td>${value || "n/a"}</td></tr>`)
    .join("");

  root.innerHTML = `
    <section class="card">
      <h1>Profile</h1>
      <table>
        <tbody>${rowHtml}</tbody>
      </table>
      <a href="#/">Back to Home</a>
    </section>
  `;
}

function render() {
  const state = getAuthState();
  const route = currentRoute();

  const protectedRoute = route === "/profile";
  if (protectedRoute && !state.isAuthenticated) {
    navigate("/");
    return;
  }

  app.innerHTML = '<main class="layout"></main>';
  const root = app.querySelector(".layout");

  if (route === "/profile") {
    renderProfile(root, state);
    return;
  }

  renderHome(root, state);
}

async function bootstrap() {
  await initializeAuth();
  render();
  window.addEventListener("hashchange", render);
  subscribeAuth(render);
}

bootstrap().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  document.body.innerHTML = `<pre style="padding:1rem;color:#b00020;white-space:pre-wrap;">Startup failed: ${message}</pre>`;
});
