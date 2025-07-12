"use client";

import { UserProvider } from "../contexts/UserContext";
import { AuthProvider } from "../contexts/AuthContext";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { AlchemyAccountProvider } from "@account-kit/react";
import { sepolia } from "viem/chains";
import { useState, useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const [isClient, setIsClient] = useState(false);

  // Check if Alchemy environment variables are set
  const hasAlchemyConfig =
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY &&
    process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <SessionContextProvider supabaseClient={supabaseClient}>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </SessionContextProvider>
    );
  }

  if (hasAlchemyConfig) {
    return (
      <SessionContextProvider supabaseClient={supabaseClient}>
        <AlchemyAccountProvider
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
        </AlchemyAccountProvider>
      </SessionContextProvider>
    );
  }

  // Fallback without Alchemy
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <AuthProvider>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </SessionContextProvider>
  );
}
