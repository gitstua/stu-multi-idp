import type { AccountInfo } from "@azure/msal-browser";
import { computed, ref } from "vue";
import type { ProviderKey } from "../auth/config";

const activeProvider = ref<ProviderKey | null>(null);
const activeAccount = ref<AccountInfo | null>(null);

export function useAuthStore() {
  const isAuthenticated = computed(() => !!activeAccount.value);

  function setSession(provider: ProviderKey | null, account: AccountInfo | null): void {
    activeProvider.value = provider;
    activeAccount.value = account;
  }

  return {
    activeProvider,
    activeAccount,
    isAuthenticated,
    setSession,
  };
}
