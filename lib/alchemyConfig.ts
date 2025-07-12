import {
  AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from "@account-kit/react";
import { alchemy, sepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const SPONSORSHIP_POLICY_ID = process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID;

// Check if Alchemy is properly configured
export const isAlchemyConfigured = !!(API_KEY && SPONSORSHIP_POLICY_ID);

if (!isAlchemyConfigured) {
  console.warn(
    "⚠️ Alchemy Smart Wallets not configured. Please set the following environment variables:",
    "\n- NEXT_PUBLIC_ALCHEMY_API_KEY",
    "\n- NEXT_PUBLIC_ALCHEMY_POLICY_ID",
    "\n\nGet your keys from: https://dashboard.alchemy.com/services/smart-wallets/configuration"
  );
}

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" }],
      [
        { type: "passkey" },
        { type: "social", authProviderId: "google", mode: "popup" },
        { type: "social", authProviderId: "facebook", mode: "popup" },
      ],
    ],
    addPasskeyOnSignup: false,
  },
};

// Only create config if environment variables are set
export const alchemyConfig = isAlchemyConfigured
  ? createConfig(
      {
        transport: alchemy({ apiKey: API_KEY! }),
        chain: sepolia,
        ssr: true,
        storage: cookieStorage,
        enablePopupOauth: true,
        policyId: SPONSORSHIP_POLICY_ID!,
      },
      uiConfig
    )
  : null;

export const queryClient = new QueryClient(); 