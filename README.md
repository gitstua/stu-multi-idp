# Dual Entra ID SPA (MSAL PKCE)

A minimal vanilla JavaScript SPA that logs in/out against two Microsoft Entra identity providers (Org A and Org B) using `@azure/msal-browser` and PKCE (public client, no client secret).

## Requirements

- Node.js 20+
- npm

## Stack and dependencies

- Runtime dependency: `@azure/msal-browser`
- No Vite, Vue, Vue Router, or TypeScript
- Static app served directly from files

## Runtime configuration

Edit `src/app-config.js`:

- `APP_ENV`: `development` or `production`
- `APP_BASE_URL_DEV`: e.g. `http://localhost:5173/`
- `APP_BASE_URL_PROD`: e.g. `https://<user>.github.io/<repo>/`
- `ENTRA_ORGA_TENANT_ID`
- `ENTRA_ORGA_CLIENT_ID`
- `ENTRA_ORGB_TENANT_ID`
- `ENTRA_ORGB_CLIENT_ID`

The app fails fast at startup if required config values are missing.

## Entra app registrations

Create one app registration per tenant (Org A + Org B):

1. Platform type: **Single-page application**
2. Redirect URIs:
   - `http://localhost:5173/`
   - `https://<user>.github.io/<repo>/`
3. Logout / post-logout redirect URIs:
   - `http://localhost:5173/`
   - `https://<user>.github.io/<repo>/`
4. No client secret
5. Delegated scopes: `openid`, `profile`, `email`

## Run locally

```bash
npm install
npm run dev
```

This serves the repo at `http://localhost:5173/` using Python’s static HTTP server.

## Build static artifact

```bash
npm run build
```

This creates `dist/` by copying:

- app files from `src/`
- `index.html`
- required MSAL browser modules from `node_modules/@azure/msal-browser/dist` and `node_modules/@azure/msal-common/dist`

## GitHub Pages

This repo includes `.github/workflows/deploy-pages.yml` which:

1. installs npm dependencies
2. patches `APP_BASE_URL_PROD` in `src/app-config.js` to the current repo URL
3. runs `npm run build`
4. uploads `dist/` to Pages

One-time setup: In repository settings, set Pages source to **GitHub Actions**.

## App behavior

- Home route: `#/`
- Protected route: `#/profile`
- Two explicit login buttons (Org A and Org B)
- One active session at a time (switching provider replaces active account)
- Logout uses provider-specific `logoutRedirect`
