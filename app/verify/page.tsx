"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import {
  CheckCircle,
  XCircle,
  Search,
  Shield,
  Award,
  Sparkles,
  Users,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState<string | null>(null);

  // Check for verification code in URL parameters on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const codeFromUrl = urlParams.get("code");
      if (codeFromUrl) {
        setVerificationCode(codeFromUrl);
        // Automatically verify the certificate
        setTimeout(() => {
          verifyCertificateWithCode(codeFromUrl);
        }, 100);
      }
    }
  }, []);

  const verifyCertificateWithCode = async (code: string) => {
    if (!code.trim()) {
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);
    setError(null);

    try {
      const response = await fetch(
        `/api/verify?code=${encodeURIComponent(code.trim())}`
      );
      const result = await response.json();

      if (result.success) {
        setVerificationResult(result);
      } else {
        setError(result.error || "Verification failed");
        setVerificationResult({
          valid: false,
        });
      }
    } catch (err) {
      console.error("Error verifying certificate:", err);
      setError("Failed to verify certificate. Please try again.");
      setVerificationResult({
        valid: false,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyCertificate = () => {
    verifyCertificateWithCode(verificationCode);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-ultra font-bold mb-4">
            <span className="text-white">Verify</span>
            <br />
            <span className="bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent">
              Certificate
            </span>
          </h1>
          <p className="text-xl text-gray-400 font-gill-sans">
            Verify the authenticity of FTLD certificates
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Verification Form */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#00FF7F] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-2xl font-ultra font-bold text-white mb-2">
                Certificate Verification
              </h2>
              <p className="text-gray-400">
                Enter the verification code to check certificate authenticity
              </p>
          </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code (e.g., FTLD-XXXX-XXXX)"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-4 text-white placeholder-gray-400 focus:border-[#00FF7F] focus:outline-none transition-colors text-center font-mono"
                  />
                </div>
              </div>

              <button
                onClick={verifyCertificate}
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-[#00FF7F] to-[#00FF7F]/80 text-black font-bold py-4 px-6 rounded-lg hover:from-[#00FF7F]/90 hover:to-[#00FF7F]/70 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Verifying Certificate...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Verify Certificate
                  </div>
                )}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 max-w-md mx-auto">
                <div className="p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                  <p className="text-red-400 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Verification Result */}
            {verificationResult && (
              <div className="mt-8">
                {verificationResult.valid ? (
                  <div className="bg-[#00FF7F]/10 border border-[#00FF7F]/30 rounded-xl p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-[#00FF7F] rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-black" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-ultra font-bold text-white text-center mb-4">
                      Certificate Verified!
                    </h3>
                    <div className="space-y-3 text-center">
                      <p className="text-gray-300">
                        <span className="text-[#00FF7F] font-semibold">
                          {verificationResult.certificate.studentName}
                        </span>{" "}
                        has successfully completed
                      </p>
                      <p className="text-xl font-bold text-white">
                        {verificationResult.certificate.program}
                      </p>
                      <p className="text-gray-400">
                        Completed on{" "}
                        {new Date(
                          verificationResult.certificate.completionDate
                        ).toLocaleDateString()}
                      </p>
                      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">
                          Verification Code
                        </p>
                        <code className="text-[#00FF7F] font-mono">
                          {verificationResult.certificate.verificationCode}
                        </code>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                        <XCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-ultra font-bold text-white text-center mb-4">
                      Certificate Not Found
                    </h3>
                    <p className="text-gray-400 text-center">
                      The verification code you entered does not match any
                      certificate in our database. Please check the code and try
                      again.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#00FF7F]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-[#00FF7F]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Secure</h3>
              <p className="text-sm text-gray-400">
                Blockchain-verified certificates that can't be forged
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#0014A8]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-[#0014A8]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant</h3>
              <p className="text-sm text-gray-400">
                Real-time verification with immediate results
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#00FF7F]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-[#00FF7F]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Trusted</h3>
              <p className="text-sm text-gray-400">
                Verified by the FTLD community and partners
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
