# Dual Entra ID Vue SPA (MSAL PKCE)

A basic Vue 3 + Vite SPA that can login/logout with two Microsoft Entra identity providers (Org A and Org B) using `@azure/msal-browser` and PKCE (public client, no client secret).

## Requirements

- Node.js 20+
- npm

## Environment configuration

Copy and edit the env files before running.

### `.env.development`

- `VITE_APP_ENV=development`
- `VITE_APP_BASE_URL_DEV=http://localhost:5173/`
- `VITE_ENTRA_ORGA_TENANT_ID=...`
- `VITE_ENTRA_ORGA_CLIENT_ID=...`
- `VITE_ENTRA_ORGB_TENANT_ID=...`
- `VITE_ENTRA_ORGB_CLIENT_ID=...`

### `.env.production`

- `VITE_APP_ENV=production`
- `VITE_APP_BASE_URL_PROD=https://<user>.github.io/<repo>/`
- `VITE_VITE_BASE_PATH=/<repo>/`
- `VITE_ENTRA_ORGA_TENANT_ID=...`
- `VITE_ENTRA_ORGA_CLIENT_ID=...`
- `VITE_ENTRA_ORGB_TENANT_ID=...`
- `VITE_ENTRA_ORGB_CLIENT_ID=...`

The app fails fast at startup if required auth env vars are missing.

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

### Example Azure CLI commands (Cloud Shell)

#### Org A

```bash
az login --tenant "<org-a-tenant-id>"
az ad app create --display-name "stu-multi-idp-org-a" --sign-in-audience AzureADMyOrg
APP_OBJECT_ID=$(az ad app list --display-name "stu-multi-idp-org-a" --query "[0].id" -o tsv)
az rest --method PATCH --url "https://graph.microsoft.com/v1.0/applications/$APP_OBJECT_ID" \
  --body '{"spa":{"redirectUris":["http://localhost:5173/","https://stu.github.io/stu-multi-idp/"]},"web":{"redirectUris":[],"logoutUrl":"https://stu.github.io/stu-multi-idp/"}}'
```

#### Org B
```bash
az login --tenant "<org-b-tenant-id>"
az ad app create --display-name "stu-multi-idp-org-b" --sign-in-audience AzureADMyOrg
APP_OBJECT_ID=$(az ad app list --display-name "stu-multi-idp-org-b" --query "[0].id" -o tsv)
az rest --method PATCH --url "https://graph.microsoft.com/v1.0/applications/$APP_OBJECT_ID" \
  --body '{"spa":{"redirectUris":["http://localhost:5173/","https://stu.github.io/stu-multi-idp/"]},"web":{"redirectUris":[],"logoutUrl":"https://stu.github.io/stu-multi-idp/"}}'
```

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production Vite base path is read from `VITE_VITE_BASE_PATH`.

## GitHub Pages

Deploy `dist/` to your GitHub Pages branch/artifact. Ensure:

1. The deployed URL exactly matches `VITE_APP_BASE_URL_PROD`
2. Entra redirect/logout URIs exactly match that same URL
3. `VITE_VITE_BASE_PATH` matches the repo path (for project pages)

## App behavior

- Home route: `#/`
- Protected route: `#/profile`
- Two explicit login buttons (Org A and Org B)
- One active session at a time (switching provider replaces active account)
- Logout uses provider-specific `logoutRedirect`
