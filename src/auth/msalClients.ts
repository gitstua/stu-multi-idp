import { PublicClientApplication } from "@azure/msal-browser";
import { providerConfigs } from "./config";

export const msalOrgA = new PublicClientApplication(providerConfigs.orga.msalConfig);
export const msalOrgB = new PublicClientApplication(providerConfigs.orgb.msalConfig);

export const msalClients = {
  orga: msalOrgA,
  orgb: msalOrgB,
} as const;
