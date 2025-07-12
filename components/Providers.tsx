"use client";

import { UserProvider } from "../contexts/UserContext";
import { AuthProvider } from "../contexts/AuthContext";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { AccountKitProvider } from "@account-kit/react";
import { sepolia } from "viem/chains";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  
  // Check if Alchemy environment variables are set
  const hasAlchemyConfig = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY && process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID;
  
  if (hasAlchemyConfig) {
    return (
      <SessionContextProvider supabaseClient={supabaseClient}>
        <AccountKitProvider
          config={{
            chain: sepolia,
            apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
            gasManagerConfig: {
              policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID!,
            },
          }}
        >
          <AuthProvider>
            <UserProvider>{children}</UserProvider>
          </AuthProvider>
        </AccountKitProvider>
      </SessionContextProvider>
    );
  }

  // Fallback without AccountKitProvider
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <AuthProvider>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </SessionContextProvider>
  );
}
