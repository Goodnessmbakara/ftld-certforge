"use client";

import { useState, useEffect } from "react";
import { X, Mail, ArrowRight, Wallet, Sparkles } from "lucide-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useAuthModal } from "@account-kit/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = useSupabaseClient();

  // Use Alchemy Account Kit modal for social login and wallet connection
  const { openAuthModal, isLoading: accountKitLoading } = useAuthModal({
    onSuccess: async (account) => {
      // account.address is the smart wallet address
      // Store this in Supabase user profile
      const user = supabase.auth.user ? await supabase.auth.user() : null;
      if (user && account?.address) {
        await supabase.from("users").upsert({
          id: user.id,
          wallet_address: account.address,
        });
      }
      onSuccess(account);
      onClose();
    },
    onError: (error) => {
      setError(error.message || "Authentication failed");
    },
  });

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
    } catch (error: any) {
      setError(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-ultra font-bold text-white">
            {mode === "signup" ? "Create Account" : "Sign In"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Alchemy Smart Wallet Social Login */}
        <div className="mb-6">
          <button
            onClick={() => openAuthModal()}
            disabled={accountKitLoading}
            className="w-full bg-gradient-to-r from-[#00FF7F] to-[#00CC66] text-black font-bold py-4 px-6 rounded-xl hover:from-[#00CC66] hover:to-[#00FF7F] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg mb-4 flex items-center justify-center gap-3"
          >
            {accountKitLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                Connecting Wallet...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Sign In with Smart Wallet / Social
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
          <div className="text-center">
            <span className="text-xs text-gray-400">Powered by Alchemy</span>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">
              or continue with email
            </span>
          </div>
        </div>

        {/* Email Authentication */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#00FF7F] focus:outline-none transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#00FF7F] focus:outline-none transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0014A8] to-[#000080] text-white font-bold py-4 px-6 rounded-xl hover:from-[#000080] hover:to-[#0014A8] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {mode === "signup" ? "Creating Account..." : "Signing In..."}
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                {mode === "signup" ? "Create Account" : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {mode === "signup"
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="text-[#00FF7F] hover:text-[#00CC66] transition-colors font-medium"
            >
              {mode === "signup" ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
