"use client";

import { useState, useEffect } from "react";
import { Download, Twitter, Linkedin, Copy, Info } from "lucide-react";
import Image from "next/image";
import QRCodeGenerator from "./QRCodeGenerator";
import html2pdf from "html2pdf.js";

interface Certificate {
  id: string;
  studentName: string;
  program: string;
  completionDate: string;
  verificationCode: string;
}

interface CertificatePreviewProps {
  certificate: Certificate;
}

export default function CertificatePreview({
  certificate,
}: CertificatePreviewProps) {
  const [showLiskBadge, setShowLiskBadge] = useState(false);

  const [verificationUrl, setVerificationUrl] = useState("");

  useEffect(() => {
    setVerificationUrl(
      `${window.location.origin}/verify?code=${certificate.verificationCode}`
    );
  }, [certificate.verificationCode]);

  const downloadPDF = () => {
    const element = document.getElementById("certificate");
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `FTLD_Certificate_${certificate.studentName.replace(
        /\s+/g,
        "_"
      )}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "landscape",
      },
    };

    // Temporarily show the certificate in print-friendly mode
    element.classList.add("print-mode");

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // Remove print mode after PDF generation
        element.classList.remove("print-mode");
      });
  };

  const shareOnTwitter = () => {
    const text = `I just completed the ${certificate.program} program! 🎓 #FTLD #Blockchain #DeFi`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(verificationUrl)}`;
    window.open(url, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      verificationUrl
    )}`;
    window.open(url, "_blank");
  };

  const copyVerificationCode = () => {
    navigator.clipboard.writeText(certificate.verificationCode);
    // Create a temporary notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-[#00FF7F] text-black px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-300";
    notification.textContent = "Verification code copied!";
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Redesigned Certificate Design */}
      <div
        className="relative bg-[#101010] text-white p-4 md:p-10 rounded-2xl shadow-2xl overflow-hidden border-4 border-[#00FF7F] print:bg-white print:text-black print:border-black print-mode:bg-white print-mode:text-black print-mode:border-black"
        id="certificate"
        style={{
          backgroundImage: "url('/pattern-bg.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
          backgroundBlendMode: "multiply",
        }}
      >
        {/* Glowing FTLD Logo */}
        <div className="flex justify-center items-center mb-8 relative">
          <div className="absolute w-32 h-32 rounded-full bg-[#00FF7F] blur-3xl opacity-20 animate-pulse"></div>
          <Image
            src="/ftld-logo.svg"
            alt="FTLD Logo"
            width={100}
            height={100}
            className="w-24 h-24 md:w-32 md:h-32 object-contain z-10 drop-shadow-[0_0_20px_#00FF7F80]"
          />
        </div>
        {/* Certificate Title */}
        <h1 className="text-4xl md:text-5xl font-ultra font-extrabold text-center mb-2 bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent tracking-tight">
          Certificate of Completion
        </h1>
        <div className="w-32 h-1.5 bg-[#00FF7F] mx-auto rounded-full mb-8"></div>
        {/* Student Name & Program */}
        <div className="text-center mb-8">
          <p className="text-lg md:text-xl text-gray-300 mb-2 font-gill-sans">
            This certifies that
          </p>
          <h2 className="text-4xl md:text-5xl font-ultra font-bold text-white mb-2 leading-tight">
            {certificate.studentName}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-2 font-gill-sans">
            has successfully completed the
          </p>
          <h3 className="text-2xl md:text-3xl font-ultra font-bold text-[#00FF7F] mb-2 leading-tight">
            {certificate.program}
          </h3>
          <p className="text-lg md:text-xl text-gray-300 font-gill-sans">
            program on{" "}
            {new Date(certificate.completionDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {/* Certificate Seal & Lisk Badge */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
          {/* Certificate Seal */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-4 border-[#0014A8] bg-[#0014A8]/20 flex items-center justify-center shadow-lg">
              <span className="text-3xl font-extrabold text-[#00FF7F]">✔</span>
            </div>
            <span className="mt-2 text-xs text-[#00FF7F] font-bold tracking-widest">
              FTLD SEAL
            </span>
          </div>
          {/* Lisk Partnership Badge */}
          <div
            className="relative group cursor-pointer"
            onMouseEnter={() => setShowLiskBadge(true)}
            onMouseLeave={() => setShowLiskBadge(false)}
          >
            <div
              className={`px-8 py-3 rounded-full border-2 border-[#0014A8] transition-all duration-300 flex items-center space-x-2 ${
                showLiskBadge
                  ? "bg-[#0014A8] text-white scale-105 shadow-lg"
                  : "bg-[#101010] text-[#0014A8]"
              }`}
            >
              <Info
                className={`w-5 h-5 ${
                  showLiskBadge ? "text-white" : "text-[#0014A8]"
                }`}
              />
              <span className="font-bold text-lg font-gill-sans">
                Powered by Lisk Partnership
              </span>
            </div>
            {showLiskBadge && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-2 bg-black text-white text-sm rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Blockchain-verified authenticity
              </div>
            )}
          </div>
        </div>
        {/* QR Code & Verification Code */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-8 mt-8">
          <div className="text-left mb-6 md:mb-0">
            <p className="text-base font-bold text-[#00FF7F] font-gill-sans mb-2">
              Verification Code:
            </p>
            <div className="bg-white/95 backdrop-blur-sm border-2 border-[#00FF7F] rounded-xl p-4 shadow-xl">
              <p className="text-3xl md:text-4xl font-mono text-black font-bold tracking-widest text-center">
                {certificate.verificationCode}
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-gill-sans">
              Use this code to verify certificate authenticity
            </p>
          </div>
          <div className="text-center">
            <div className="inline-block bg-white p-3 rounded-xl shadow-xl border-2 border-[#0014A8]">
              {verificationUrl && (
                <QRCodeGenerator value={verificationUrl} size={140} />
              )}
            </div>
            <p className="text-sm mt-3 text-gray-400 font-gill-sans font-semibold">
              Scan QR code to verify
            </p>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <button
          onClick={downloadPDF}
          className="flex items-center space-x-2 bg-[#00FF7F] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#00FF7F]/80 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Download className="w-5 h-5" />
          <span>Download PDF</span>
        </button>
        <button
          onClick={shareOnTwitter}
          className="flex items-center space-x-2 bg-[#1DA1F2] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#1DA1F2]/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Twitter className="w-5 h-5" />
          <span>Share on X</span>
        </button>
        <button
          onClick={shareOnLinkedIn}
          className="flex items-center space-x-2 bg-[#0077B5] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0077B5]/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Linkedin className="w-5 h-5" />
          <span>Share on LinkedIn</span>
        </button>
        <button
          onClick={copyVerificationCode}
          className="flex items-center space-x-2 bg-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Copy className="w-5 h-5" />
          <span>Copy Code</span>
        </button>
      </div>
    </div>
  );
}
