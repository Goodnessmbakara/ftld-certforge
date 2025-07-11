"use client";

import { useState, useEffect } from "react";
import { X, Mail, Wallet, Sparkles, Shield, ArrowRight } from "lucide-react";
import { createAlchemySmartAccountClient } from "@alchemy/aa-alchemy";
import { sepolia } from "viem/chains";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);
  const supabase = useSupabaseClient();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setError("");
      setMode("signup");
    }
  }, [isOpen]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          // Create Alchemy Smart Wallet for new user
          await createSmartWallet(data.user.id);
          onSuccess(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          onSuccess(data.user);
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const createSmartWallet = async (userId: string) => {
    try {
      const smartAccountClient = await createAlchemySmartAccountClient({
        chain: sepolia,
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
        gasManagerConfig: {
          policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID!,
        },
      });

      const address = await smartAccountClient.account?.getAddress();
      if (address) {
        // Update user profile with wallet address
        const { error: updateError } = await supabase
          .from("users")
          .update({ wallet_address: address })
          .eq("id", userId);
        
        if (updateError) {
          console.error("Failed to save wallet address:", updateError);
        }
      }
    } catch (err) {
      console.error("Failed to create smart wallet:", err);
      // Don't throw error here as user can still use the app without wallet
    }
  };

  const handleWalletAuth = async () => {
    setWalletLoading(true);
    setError("");

    try {
      // Create a unique email for wallet-based authentication
      const walletEmail = `wallet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@ftld.demo`;
      const walletPassword = "wallet-auth-" + Math.random().toString(36).substr(2, 12);

      const { data, error } = await supabase.auth.signUp({
        email: walletEmail,
        password: walletPassword,
      });

      if (error) throw error;
      if (data.user) {
        await createSmartWallet(data.user.id);
        onSuccess(data.user);
      }
    } catch (err: any) {
      setError("Wallet connection failed. Please try email authentication.");
    } finally {
      setWalletLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#101010] border border-[#00FF7F] rounded-2xl p-6 w-full max-w-md relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300FF7F' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-[#00FF7F] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-ultra font-bold text-white mb-2">
            {mode === "signup" ? "Join FTLD" : "Welcome Back"}
          </h2>
          <p className="text-gray-400">
            {mode === "signup" 
              ? "Create your account and get your Smart Wallet" 
              : "Sign in to access your certificates"
            }
          </p>
        </div>

        {/* Wallet Auth Button */}
        <button
          onClick={handleWalletAuth}
          disabled={walletLoading}
          className="w-full bg-gradient-to-r from-[#00FF7F] to-[#00CC66] text-black font-bold py-3 px-4 rounded-xl mb-6 flex items-center justify-center space-x-2 hover:from-[#00CC66] hover:to-[#00FF7F] transition-all duration-300 disabled:opacity-50"
        >
          {walletLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
          ) : (
            <>
              <Wallet size={20} />
              <span>Connect Smart Wallet</span>
              <Sparkles size={16} />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-700" />
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-700" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-[#00FF7F] focus:outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#00FF7F] focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] border border-[#00FF7F] text-[#00FF7F] font-bold py-3 px-4 rounded-xl hover:bg-[#00FF7F] hover:text-black transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00FF7F]" />
            ) : (
              <>
                <span>{mode === "signup" ? "Create Account" : "Sign In"}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="text-[#00FF7F] hover:text-[#00CC66] ml-1 font-medium transition-colors"
            >
              {mode === "signup" ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

        {/* FTLD Branding */}
        <div className="text-center mt-6 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Powered by <span className="text-[#00FF7F] font-bold">FTLD</span> Smart Wallets
          </p>
        </div>
      </div>
    </div>
  );
} 