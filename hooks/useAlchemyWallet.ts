import { useEffect, useState } from "react";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { sepolia } from "viem/chains";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { getOrCreateWalletAddress } from "../lib/utils";

export function useAlchemyWallet() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const setupWallet = async () => {
      try {
        const chain = sepolia;
        const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
        const provider = new AlchemyProvider({
          chain,
          entryPointAddress,
          rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        });
        setProvider(provider);
        const address = await getOrCreateWalletAddress(supabase, user.id, provider);
        setWalletAddress(address);
      } catch (err) {
        setError(err.message || "Failed to setup wallet");
      } finally {
        setLoading(false);
      }
    };
    setupWallet();
  }, [user, supabase]);

  return { provider, walletAddress, loading, error };
} 