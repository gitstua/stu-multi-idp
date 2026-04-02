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

- `APP_ENV`: set to `production` for deployed usage
- `APP_BASE_URL_DEV`: `http://localhost:5173/`
- `APP_BASE_URL_PROD`: `https://gitstua.github.io/stu-multi-idp/`
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
npm run sync:vendor
```

PowerShell Core alternative:

```bash
npm run sync:vendor:pwsh
```

Then open the project in VS Code and use the Live Server extension:

[VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server)

## Script roles

- `sync-vendor` scripts: copy MSAL browser artifacts from `node_modules` into `vendor/` for local static serving.
- `build-static` scripts: run vendor sync, then create deployable `dist/` content.
- `npm run build` and `npm run build:pwsh`: call the build-static scripts (you do not need to run sync separately first).

## Build static artifact

```bash
npm run build
```

PowerShell Core alternative:

```bash
npm run build:pwsh
```

This creates `dist/` by copying:

- app files from `src/`
- `index.html`
- required MSAL browser modules via `scripts/sync-vendor.sh` into `vendor/`, then into `dist/vendor/`

## GitHub Pages

This repo includes `.github/workflows/deploy-pages.yml` which:

1. installs npm dependencies
2. runs `npm run build`
3. uploads `dist/` to Pages

One-time setup: In repository settings, set Pages source to **GitHub Actions**.

## App behavior

- Home route: `#/`
- Protected route: `#/profile`
- Two explicit login buttons (Org A and Org B)
- One active session at a time (switching provider replaces active account)
- Logout uses provider-specific `logoutRedirect`
