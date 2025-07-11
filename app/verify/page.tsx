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

  const verifyCertificate = async () => {
    if (!verificationCode.trim()) {
      alert("Please enter a verification code");
      return;
    }
    await verifyCertificateWithCode(verificationCode);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      verifyCertificate();
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-6">
              <div className="w-16 h-16 bg-[#00FF7F] rounded-full flex items-center justify-center mr-4 shadow-lg">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-5xl font-ultra font-bold bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent">
                Certificate Verification
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-gill-sans">
              Verify the authenticity of FTLD certificates with our secure
              blockchain-powered verification system
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-[#00FF7F] transition-all duration-300">
              <div className="w-12 h-12 bg-[#00FF7F] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">127+</h3>
              <p className="text-gray-400">Verified Certificates</p>
            </div>
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-[#0014A8] transition-all duration-300">
              <div className="w-12 h-12 bg-[#0014A8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">100%</h3>
              <p className="text-gray-400">Security Rate</p>
            </div>
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-[#00FF7F] transition-all duration-300">
              <div className="w-12 h-12 bg-[#00FF7F] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">24/7</h3>
              <p className="text-gray-400">Verification Available</p>
            </div>
          </div>

          {/* Verification Form */}
          <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 shadow-2xl mb-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#00FF7F] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Search className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Verify Certificate
              </h2>
              <p className="text-gray-400">
                Enter the verification code to confirm authenticity
              </p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-medium mb-2 text-[#00FF7F]"
                >
                  Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter verification code (e.g., FTLD-XXXX-XXXX)"
                    className="w-full px-4 py-4 pl-12 pr-4 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#00FF7F] focus:outline-none transition-all duration-300 text-center font-mono text-lg"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                    <Sparkles className="w-5 h-5 mr-2" />
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
              <div className="mt-8 max-w-md mx-auto">
                <div
                  className={`p-6 rounded-xl border-2 shadow-lg ${
                    verificationResult.valid
                      ? "border-[#00FF7F] bg-[#00FF7F]/10"
                      : "border-red-500 bg-red-500/10"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    {verificationResult.valid ? (
                      <div className="w-12 h-12 bg-[#00FF7F] rounded-full flex items-center justify-center mr-4">
                        <CheckCircle className="w-6 h-6 text-black" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                        <XCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {verificationResult.valid
                          ? "Certificate Valid"
                          : "Certificate Invalid"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {verificationResult.valid
                          ? "Authentic FTLD Certificate"
                          : "Verification Failed"}
                      </p>
                    </div>
                  </div>

                  {verificationResult.valid &&
                  verificationResult.certificate ? (
                    <div className="space-y-3 text-gray-300">
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="font-medium text-[#00FF7F]">
                          Student:
                        </span>
                        <span className="text-white">
                          {verificationResult.certificate.studentName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="font-medium text-[#00FF7F]">
                          Program:
                        </span>
                        <span className="text-white">
                          {verificationResult.certificate.program}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium text-[#00FF7F]">
                          Completion Date:
                        </span>
                        <span className="text-white">
                          {new Date(
                            verificationResult.certificate.completionDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-4 p-3 bg-[#00FF7F]/20 rounded-lg border border-[#00FF7F]/30">
                        <p className="text-sm text-[#00FF7F] font-medium">
                          ✓ This certificate has been verified as authentic and
                          is stored on the blockchain
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                      <p className="text-red-400 font-medium">
                        The verification code entered is invalid or
                        unrecognized. Please check the code and try again.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-[#0014A8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                How to Verify
              </h3>
              <p className="text-gray-400">
                Follow these steps to verify your FTLD certificate
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#00FF7F] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Locate the Verification Code
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Find the verification code on your certificate (format:
                      FTLD-XXXX-XXXX)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#00FF7F] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Enter the Code
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Type or paste the verification code into the input field
                      above
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#00FF7F] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Scan QR Code (Optional)
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Use your phone's camera to scan the QR code on the
                      certificate
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#00FF7F] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">View Results</h4>
                    <p className="text-gray-400 text-sm">
                      Valid certificates will show student details and
                      completion information
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
