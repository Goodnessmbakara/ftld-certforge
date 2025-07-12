"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

interface UserContextType {
  user: any;
  displayName?: string;
  phone?: string;
  role?: string;
  loading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user.email) {
        setLoading(true);
        const { data, error } = await supabase
          .from("users")
          .select("display_name, phone, role")
          .eq("email", user.email)
          .single();
        if (!error && data) {
          setDisplayName(data.display_name);
          setPhone(data.phone);
          setRole(data.role);
        } else {
          setDisplayName(undefined);
          setPhone(undefined);
          setRole(undefined);
        }
        setLoading(false);
      } else {
        setDisplayName(undefined);
        setPhone(undefined);
        setRole(undefined);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      const event = new CustomEvent("sign-out");
      window.dispatchEvent(event);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, displayName, phone, role, loading, signOut }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
