"use client"

import type React from "react"

import { useState } from "react"
import Header from "@/components/Header"
import { CheckCircle, XCircle, Search } from "lucide-react"

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)

  const verifyCertificate = async () => {
    if (!verificationCode.trim()) {
      alert("Please enter a verification code")
      return
    }

    setIsVerifying(true)
    setVerificationResult(null)

    // Simulate API call
    setTimeout(() => {
      // Mock verification logic
      const isValid = verificationCode.startsWith("FTLD-")

      if (isValid) {
        setVerificationResult({
          valid: true,
          studentName: "John Doe",
          program: "Smart Contract Training (Lisk)",
          completionDate: "2024-01-15",
        })
      } else {
        setVerificationResult({
          valid: false,
        })
      }

      setIsVerifying(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      verifyCertificate()
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Certificate Verification</h1>
            <p className="text-xl text-gray-400">Enter a verification code to confirm certificate authenticity</p>
          </div>

          <div className="card">
            <div className="space-y-6">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium mb-2">
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
                    className="input-field pr-12"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button
                onClick={verifyCertificate}
                disabled={isVerifying}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? "Verifying..." : "Verify Certificate"}
              </button>
            </div>

            {/* Verification Result */}
            {verificationResult && (
              <div
                className={`mt-8 p-6 rounded-lg border-2 fade-in ${
                  verificationResult.valid ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
                }`}
              >
                <div className="flex items-center mb-4">
                  {verificationResult.valid ? (
                    <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500 mr-3" />
                  )}
                  <h3 className="text-xl font-bold">
                    {verificationResult.valid ? "Certificate Valid" : "Certificate Invalid"}
                  </h3>
                </div>

                {verificationResult.valid ? (
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <strong>Student:</strong> {verificationResult.studentName}
                    </p>
                    <p>
                      <strong>Program:</strong> {verificationResult.program}
                    </p>
                    <p>
                      <strong>Completion Date:</strong>{" "}
                      {new Date(verificationResult.completionDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-green-400 mt-4">✓ This certificate has been verified as authentic</p>
                  </div>
                ) : (
                  <p className="text-red-400">
                    The verification code entered is invalid or unrecognized. Please check the code and try again.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-12 card">
            <h3 className="text-xl font-bold mb-4">How to Verify</h3>
            <div className="space-y-3 text-gray-400">
              <p>• Enter the verification code found on the certificate</p>
              <p>• Scan the QR code on the certificate to auto-fill the code</p>
              <p>• Verification codes follow the format: FTLD-XXXX-XXXX</p>
              <p>• Valid certificates will show student details and completion information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
