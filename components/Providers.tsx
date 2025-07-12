"use client";

import { UserProvider } from "../contexts/UserContext";
import { AuthProvider } from "../contexts/AuthContext";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { AlchemyAccountProvider } from "@account-kit/react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  alchemyConfig,
  queryClient,
  isAlchemyConfigured,
} from "../lib/alchemyConfig";
import { useState, useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <SessionContextProvider supabaseClient={supabaseClient}>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </SessionContextProvider>
    );
  }

  // If Alchemy is not configured, render without AlchemyAccountProvider
  if (!isAlchemyConfigured || !alchemyConfig) {
    return (
      <SessionContextProvider supabaseClient={supabaseClient}>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </SessionContextProvider>
    );
  }

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <QueryClientProvider client={queryClient}>
        <AlchemyAccountProvider
          config={alchemyConfig}
          queryClient={queryClient}
        >
          <AuthProvider>
            <UserProvider>{children}</UserProvider>
          </AuthProvider>
        </AlchemyAccountProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}
