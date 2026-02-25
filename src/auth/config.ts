import type { Configuration, RedirectRequest } from "@azure/msal-browser";

export type ProviderKey = "orga" | "orgb";

export interface ProviderRuntimeConfig {
  label: string;
  tenantId: string;
  clientId: string;
  authority: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
  loginRequest: RedirectRequest;
  msalConfig: Configuration;
}

function requireEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function resolveBaseUrl(): string {
  const appEnv = requireEnv("VITE_APP_ENV");
  const devUrl = requireEnv("VITE_APP_BASE_URL_DEV");
  const prodUrl = requireEnv("VITE_APP_BASE_URL_PROD");

  const baseUrl = appEnv === "production" ? prodUrl : devUrl;
  if (appEnv === "production" && /<|>/.test(baseUrl)) {
    throw new Error(
      "VITE_APP_BASE_URL_PROD still contains placeholder values. Set your real GitHub Pages URL.",
    );
  }

  return baseUrl;
}

function normalizeUrl(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

const redirectBaseUrl = normalizeUrl(resolveBaseUrl());

function buildProviderConfig(
  label: string,
  tenantIdVar: keyof ImportMetaEnv,
  clientIdVar: keyof ImportMetaEnv,
): ProviderRuntimeConfig {
  const tenantId = requireEnv(tenantIdVar);
  const clientId = requireEnv(clientIdVar);
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

export const providerConfigs: Record<ProviderKey, ProviderRuntimeConfig> = {
  orga: buildProviderConfig("Org A", "VITE_ENTRA_ORGA_TENANT_ID", "VITE_ENTRA_ORGA_CLIENT_ID"),
  orgb: buildProviderConfig("Org B", "VITE_ENTRA_ORGB_TENANT_ID", "VITE_ENTRA_ORGB_CLIENT_ID"),
};
