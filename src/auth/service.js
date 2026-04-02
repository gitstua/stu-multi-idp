import { providerConfigs } from "./config.js";
import { msalClients } from "./msalClients.js";
import { getAuthState, setSession } from "../store/auth.js";

const ACTIVE_PROVIDER_STORAGE_KEY = "active_msal_provider";

function setStoredProvider(provider) {
  if (!provider) {
    sessionStorage.removeItem(ACTIVE_PROVIDER_STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(ACTIVE_PROVIDER_STORAGE_KEY, provider);
}

function getStoredProvider() {
  const value = sessionStorage.getItem(ACTIVE_PROVIDER_STORAGE_KEY);
  if (value === "orga" || value === "orgb") {
    return value;
  }
  return null;
}

function handleRedirectForProvider(provider, hash) {
  return msalClients[provider].handleRedirectPromise(hash);
}

function resolveCachedSession(provider) {
  const client = msalClients[provider];
  const account = client.getActiveAccount() ?? client.getAllAccounts()[0] ?? null;
  if (account) {
    client.setActiveAccount(account);
  }
  return account;
}

export async function initializeAuth() {
  await Promise.all([msalClients.orga.initialize(), msalClients.orgb.initialize()]);

  const hash = window.location.hash;
  const [orgaResult, orgbResult] = await Promise.all([
    handleRedirectForProvider("orga", hash),
    handleRedirectForProvider("orgb", hash),
  ]);

  if (orgaResult?.account) {
    msalClients.orga.setActiveAccount(orgaResult.account);
    setSession("orga", orgaResult.account);
    setStoredProvider("orga");
    return;
  }

  if (orgbResult?.account) {
    msalClients.orgb.setActiveAccount(orgbResult.account);
    setSession("orgb", orgbResult.account);
    setStoredProvider("orgb");
    return;
  }

  const storedProvider = getStoredProvider();
  if (storedProvider) {
    const account = resolveCachedSession(storedProvider);
    if (account) {
      setSession(storedProvider, account);
      return;
    }
  }

  setSession(null, null);
  setStoredProvider(null);
}

export async function login(provider) {
  const client = msalClients[provider];
  setStoredProvider(provider);
  await client.loginRedirect(providerConfigs[provider].loginRequest);
}

export async function logout() {
  const { activeProvider, activeAccount } = getAuthState();

  if (!activeProvider || !activeAccount) {
    setSession(null, null);
    setStoredProvider(null);
    return;
  }

  setSession(null, null);
  setStoredProvider(null);

  await msalClients[activeProvider].logoutRedirect({
    account: activeAccount,
    postLogoutRedirectUri: providerConfigs[activeProvider].postLogoutRedirectUri,
  });
}
