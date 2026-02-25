<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { providerConfigs } from "../auth/config";
import { useAuthStore } from "../store/auth";

const { activeAccount, activeProvider } = useAuthStore();

const claims = computed(() => {
  const idTokenClaims = activeAccount.value?.idTokenClaims as Record<string, unknown> | undefined;

  return [
    ["name", activeAccount.value?.name],
    ["username", activeAccount.value?.username],
    ["tenant (tid)", idTokenClaims?.tid as string | undefined],
    ["object id (oid)", idTokenClaims?.oid as string | undefined],
    ["provider", activeProvider.value ? providerConfigs[activeProvider.value].label : undefined],
  ];
});
</script>

<template>
  <section class="card">
    <h1>Profile</h1>
    <p v-if="!activeAccount">No active account.</p>
    <table v-else>
      <tbody>
        <tr v-for="([key, value], idx) in claims" :key="`${key}-${idx}`">
          <th>{{ key }}</th>
          <td>{{ value || 'n/a' }}</td>
        </tr>
      </tbody>
    </table>
    <RouterLink to="/">Back to Home</RouterLink>
  </section>
</template>
