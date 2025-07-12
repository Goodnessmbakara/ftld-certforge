"use client";

import { Download } from "lucide-react";
import html2pdf from "html2pdf.js";

interface Certificate {
  id: string;
  studentName: string;
  program: string;
  completionDate: string;
  verificationCode: string;
  createdAt: string;
}

interface DownloadCertificateButtonProps {
  certificate: Certificate;
}

export default function DownloadCertificateButton({
  certificate,
}: DownloadCertificateButtonProps) {
  const downloadCertificate = (cert: Certificate) => {
    // Create a hidden div with the certificate HTML
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="font-family: 'Gill Sans', Arial, sans-serif; padding: 32px; background: #fff; border-radius: 16px; width: 480px; margin: 0 auto;">
        <h1 style="color: #00FF7F; font-size: 2.2em; margin-bottom: 0.5em;">FTLD CertForge</h1>
        <h2 style="color: #0014A8; margin-bottom: 1em;">Certificate of Completion</h2>
        <p style="font-size: 1.1em; color: #222; margin-bottom: 1.5em;">This certifies that</p>
        <h3 style="font-size: 1.5em; color: #00FF7F; margin-bottom: 0.5em;">${cert.studentName}</h3>
        <p style="font-size: 1.1em; color: #222; margin-bottom: 1em;">has successfully completed the</p>
        <p style="font-size: 1.2em; color: #0014A8; font-weight: bold; margin-bottom: 1em;">${cert.program}</p>
        <p style="font-size: 1.1em; color: #222; margin-bottom: 1em;">on <b>${cert.completionDate}</b></p>
        <p style="font-size: 1em; color: #888; margin-bottom: 1em;">Verification Code: <b>${cert.verificationCode}</b></p>
        <div style="margin-top: 2em; color: #888; font-size: 0.95em;">For The Love Of DeFi</div>
      </div>
    `;
    document.body.appendChild(element);
    html2pdf()
      .from(element)
      .set({
        margin: 0,
        filename: `certificate-${cert.studentName}.pdf`,
        html2canvas: { scale: 2 },
      })
      .save()
      .then(() => {
        document.body.removeChild(element);
      });
  };

  return (
    <button
      onClick={() => downloadCertificate(certificate)}
      className="bg-[#00FF7F] text-black p-2 rounded-lg hover:bg-[#00CC66] transition-colors"
      title="Download Certificate"
    >
      <Download className="w-4 h-4" />
    </button>
  );
}
