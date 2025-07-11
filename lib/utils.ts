import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateCertificateId(): string {
  return `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function generateVerificationCode(): string {
  const part1 = Math.random().toString(36).substr(2, 4).toUpperCase()
  const part2 = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `FTLD-${part1}-${part2}`
}

// Utility to get and update wallet address for a user in Supabase
export async function getOrCreateWalletAddress(supabase, userId, client) {
  // 1. Try to fetch wallet_address from Supabase
  const { data, error } = await supabase
    .from('users')
    .select('wallet_address')
    .eq('id', userId)
    .single();

  if (error) throw error;
  if (data && data.wallet_address) return data.wallet_address;

  // 2. If not present, create a new wallet and save
  const address = await client.account?.getAddress();
  if (!address) throw new Error('Failed to get wallet address');
  
  const { error: updateError } = await supabase
    .from('users')
    .update({ wallet_address: address })
    .eq('id', userId);
    
  if (updateError) throw updateError;
  return address;
}
