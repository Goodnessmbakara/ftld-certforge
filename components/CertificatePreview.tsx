"use client"

import { useState } from "react"
import { Download, Twitter, Linkedin, Copy, Info } from "lucide-react"
import QRCodeGenerator from "./QRCodeGenerator"

interface Certificate {
  id: string
  studentName: string
  program: string
  completionDate: string
  verificationCode: string
}

interface CertificatePreviewProps {
  certificate: Certificate
}

export default function CertificatePreview({ certificate }: CertificatePreviewProps) {
  const [showLiskBadge, setShowLiskBadge] = useState(false)

  const verificationUrl = `https://ftld-certforge.org/verify?code=${certificate.verificationCode}`

  const downloadPDF = () => {
    // In a real implementation, you would use html2pdf.js or similar
    alert("PDF download functionality would be implemented here using html2pdf.js")
  }

  const shareOnTwitter = () => {
    const text = `I just completed the ${certificate.program} program! 🎓 #FTLD #Blockchain #DeFi`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(verificationUrl)}`
    window.open(url, "_blank")
  }

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}`
    window.open(url, "_blank")
  }

  const copyVerificationCode = () => {
    navigator.clipboard.writeText(certificate.verificationCode)
    alert("Verification code copied to clipboard!")
  }

  return (
    <div className="space-y-6">
      {/* Certificate Design */}
      <div className="bg-white text-black p-4 md:p-8 rounded-lg shadow-2xl relative overflow-hidden" id="certificate">
        {/* Subtle background pattern - replace with actual 'Brand Pattern 1 - Black.png' */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('/pattern-bg.png')`, // Placeholder for your brand pattern
            backgroundRepeat: "repeat",
            backgroundSize: "100px",
          }}
        ></div>

        <div className="relative z-10 border-4 border-green-400 p-4 md:p-8 rounded-lg flex flex-col items-center text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              {/* FTLD Logo placeholder - replace with actual 'Green Logo' image */}
              <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <span className="text-black font-bold text-4xl">F</span>
              </div>
              <div>
                <h1 className="text-5xl font-extrabold text-blue-800 tracking-tight">FTLD</h1>
                <p className="text-lg text-gray-600 font-gill-sans">For The Love of DeFi</p>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-2 font-gill-sans">
              Certificate of Completion
            </h2>
            <div className="w-32 h-1.5 bg-green-400 mx-auto rounded-full"></div>
          </div>

          {/* Certificate Content */}
          <div className="mb-8 max-w-2xl">
            <p className="text-xl text-gray-700 mb-4 font-gill-sans">This certifies that</p>
            <h3 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4 font-gill-sans leading-tight">
              {certificate.studentName}
            </h3>
            <p className="text-xl text-gray-700 mb-2 font-gill-sans">has successfully completed the</p>
            <h4 className="text-3xl md:text-4xl font-bold text-green-400 mb-4 font-gill-sans leading-tight">
              {certificate.program}
            </h4>
            <p className="text-xl text-gray-700 font-gill-sans">
              program on{" "}
              {new Date(certificate.completionDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Lisk Partnership Badge */}
          <div className="flex justify-center mb-8">
            <div
              className="relative group"
              onMouseEnter={() => setShowLiskBadge(true)}
              onMouseLeave={() => setShowLiskBadge(false)}
            >
              <div
                className={`px-8 py-3 rounded-full border-2 border-blue-800 transition-all duration-300 cursor-pointer flex items-center space-x-2 ${
                  showLiskBadge ? "bg-blue-800 text-white transform scale-105 shadow-lg" : "bg-white text-blue-800"
                }`}
              >
                <Info className={`w-5 h-5 ${showLiskBadge ? "text-white" : "text-blue-800"}`} />
                <span className="font-bold text-lg font-gill-sans">Powered by Lisk Partnership</span>
              </div>
              {showLiskBadge && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-2 bg-black text-white text-sm rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Blockchain-verified authenticity
                </div>
              )}
            </div>
          </div>

          {/* Footer with QR Code and Verification */}
          <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-8">
            <div className="text-left mb-6 md:mb-0">
              <p className="text-base font-bold text-gray-700 font-gill-sans">Verification Code:</p>
              <p className="text-2xl font-mono text-blue-800 font-bold">{certificate.verificationCode}</p>
            </div>

            <div className="text-center">
              <QRCodeGenerator value={verificationUrl} size={120} />
              <p className="text-sm mt-2 text-gray-600 font-gill-sans">Scan to verify authenticity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <button
          onClick={downloadPDF}
          className="flex items-center space-x-2 bg-green-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-green-300 transition-all duration-300 transform hover:scale-105"
        >
          <Download className="w-5 h-5" />
          <span>Download PDF</span>
        </button>

        <button
          onClick={shareOnTwitter}
          className="flex items-center space-x-2 bg-[#1DA1F2] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#1DA1F2]/90 transition-all duration-300 transform hover:scale-105"
        >
          <Twitter className="w-5 h-5" />
          <span>Share on X</span>
        </button>

        <button
          onClick={shareOnLinkedIn}
          className="flex items-center space-x-2 bg-[#0077B5] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0077B5]/90 transition-all duration-300 transform hover:scale-105"
        >
          <Linkedin className="w-5 h-5" />
          <span>Share on LinkedIn</span>
        </button>

        <button
          onClick={copyVerificationCode}
          className="flex items-center space-x-2 bg-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
        >
          <Copy className="w-5 h-5" />
          <span>Copy Code</span>
        </button>
      </div>
    </div>
  )
}
