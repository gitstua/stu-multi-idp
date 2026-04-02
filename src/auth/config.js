/** @typedef {'orga' | 'orgb'} ProviderKey */

const runtimeConfig = window.__APP_CONFIG__ ?? {};

function requireConfig(name) {
  const value = runtimeConfig[name]?.trim();
  if (!value) {
    throw new Error(`Missing required runtime config value: ${name}`);
  }
  return value;
}

function resolveBaseUrl() {
  const appEnv = requireConfig("APP_ENV");
  const devUrl = requireConfig("APP_BASE_URL_DEV");
  const prodUrl = requireConfig("APP_BASE_URL_PROD");

  const baseUrl = appEnv === "production" ? prodUrl : devUrl;
  if (appEnv === "production" && /<|>/.test(baseUrl)) {
    throw new Error(
      "APP_BASE_URL_PROD still contains placeholder values. Set your real GitHub Pages URL.",
    );
  }

  return baseUrl;
}

function normalizeUrl(url) {
  return url.endsWith("/") ? url : `${url}/`;
}

const redirectBaseUrl = normalizeUrl(resolveBaseUrl());

function buildProviderConfig(label, tenantIdVar, clientIdVar) {
  const tenantId = requireConfig(tenantIdVar);
  const clientId = requireConfig(clientIdVar);
  const authority = `https://login.microsoftonline.com/${tenantId}/v2.0`;

  return {
    label,
    tenantId,
    clientId,
    authority,
    redirectUri: redirectBaseUrl,
    postLogoutRedirectUri: redirectBaseUrl,
    loginRequest: {
      scopes: ["openid", "profile", "email"],
      redirectUri: redirectBaseUrl,
    },
    msalConfig: {
      auth: {
        clientId,
        authority,
        redirectUri: redirectBaseUrl,
        postLogoutRedirectUri: redirectBaseUrl,
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
      },
    },
  };
}

export const providerConfigs = {
  orga: buildProviderConfig("Org A", "ENTRA_ORGA_TENANT_ID", "ENTRA_ORGA_CLIENT_ID"),
  orgb: buildProviderConfig("Org B", "ENTRA_ORGB_TENANT_ID", "ENTRA_ORGB_CLIENT_ID"),
};
