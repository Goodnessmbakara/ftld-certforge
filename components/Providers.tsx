"use client";

import { UserProvider } from "../contexts/UserContext";
import { AuthProvider } from "../contexts/AuthContext";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
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

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <AuthProvider>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </SessionContextProvider>
  );
}
