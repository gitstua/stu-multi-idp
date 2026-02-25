import type { AccountInfo, AuthenticationResult } from "@azure/msal-browser";
import type { ProviderKey } from "./config";
import { providerConfigs } from "./config";
import { msalClients } from "./msalClients";
import { useAuthStore } from "../store/auth";

const ACTIVE_PROVIDER_STORAGE_KEY = "active_msal_provider";

function setStoredProvider(provider: ProviderKey | null): void {
  if (!provider) {
    sessionStorage.removeItem(ACTIVE_PROVIDER_STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(ACTIVE_PROVIDER_STORAGE_KEY, provider);
}

function getStoredProvider(): ProviderKey | null {
  const value = sessionStorage.getItem(ACTIVE_PROVIDER_STORAGE_KEY);
  if (value === "orga" || value === "orgb") {
    return value;
  }
  return null;
}

async function handleRedirectForProvider(
  provider: ProviderKey,
  hash: string,
): Promise<AuthenticationResult | null> {
  return msalClients[provider].handleRedirectPromise(hash);
}

function resolveCachedSession(provider: ProviderKey): AccountInfo | null {
  const client = msalClients[provider];
  const account = client.getActiveAccount() ?? client.getAllAccounts()[0] ?? null;
  if (account) {
    client.setActiveAccount(account);
  }
  return account;
}

export async function initializeAuth(): Promise<void> {
  const { setSession } = useAuthStore();

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

export async function login(provider: ProviderKey): Promise<void> {
  const client = msalClients[provider];
  setStoredProvider(provider);
  await client.loginRedirect(providerConfigs[provider].loginRequest);
}

export async function logout(): Promise<void> {
  const { activeProvider, activeAccount, setSession } = useAuthStore();

  if (!activeProvider.value || !activeAccount.value) {
    setSession(null, null);
    setStoredProvider(null);
    return;
  }

  const provider = activeProvider.value;
  const account = activeAccount.value;

  setSession(null, null);
  setStoredProvider(null);

  await msalClients[provider].logoutRedirect({
    account,
    postLogoutRedirectUri: providerConfigs[provider].postLogoutRedirectUri,
  });
}
