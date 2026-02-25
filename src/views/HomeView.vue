<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { login, logout } from "../auth/service";
import { providerConfigs, type ProviderKey } from "../auth/config";
import { useAuthStore } from "../store/auth";

const { activeAccount, activeProvider, isAuthenticated } = useAuthStore();

const signedInAs = computed(() => {
  if (!activeAccount.value) {
    return "Not signed in";
  }
  return activeAccount.value.name ?? activeAccount.value.username;
});

const providerLabel = computed(() => {
  if (!activeProvider.value) {
    return "None";
  }
  return providerConfigs[activeProvider.value].label;
});

async function loginWith(provider: ProviderKey): Promise<void> {
  await login(provider);
}
</script>

<template>
  <section class="card">
    <h1>Dual Entra ID Login Demo</h1>
    <p>
      Authenticate with one of two Microsoft Entra tenants using MSAL browser PKCE.
    </p>
    <p><strong>Status:</strong> {{ signedInAs }}</p>
    <p><strong>Active provider:</strong> {{ providerLabel }}</p>

    <div class="actions">
      <button type="button" @click="loginWith('orga')">Login with Org A</button>
      <button type="button" @click="loginWith('orgb')">Login with Org B</button>
      <button v-if="isAuthenticated" type="button" class="danger" @click="logout">
        Logout
      </button>
    </div>

    <RouterLink v-if="isAuthenticated" to="/profile">Go to Profile</RouterLink>
  </section>
</template>
