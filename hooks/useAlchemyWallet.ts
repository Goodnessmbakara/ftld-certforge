import { useEffect, useState } from "react";
import { createAlchemySmartAccountClient } from "@alchemy/aa-alchemy";
import { sepolia } from "viem/chains";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { getOrCreateWalletAddress } from "../lib/utils";

export function useAlchemyWallet() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [client, setClient] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setClient(null);
      setWalletAddress(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const setupWallet = async () => {
      try {
        // Check if we already have a wallet address in the user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('wallet_address')
          .eq('id', user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          throw userError;
        }

        // If user already has a wallet address, use it
        if (userData?.wallet_address) {
          setWalletAddress(userData.wallet_address);
          setLoading(false);
          return;
        }

        // Create Alchemy Smart Account Client only if needed
        const smartAccountClient = await createAlchemySmartAccountClient({
          chain: sepolia,
          apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
          gasManagerConfig: {
            policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID!,
          },
        });

        setClient(smartAccountClient);

        // Get or create wallet address and save to Supabase
        const address = await getOrCreateWalletAddress(supabase, user.id, smartAccountClient);
        setWalletAddress(address);
      } catch (err) {
        console.error("Error setting up Alchemy wallet:", err);
        setError(err.message || "Failed to setup wallet");
      } finally {
        setLoading(false);
      }
    };

    setupWallet();
  }, [user?.id, supabase]);

  return {
    client,
    walletAddress,
    loading,
    error,
  };
} 