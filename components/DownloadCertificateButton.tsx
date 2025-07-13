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
  const downloadCertificate = async (cert: Certificate) => {
    // Create a hidden div with the professional certificate HTML
    const element = document.createElement("div");
    element.innerHTML = `
      <div id="certificate-pdf" style="
        width: 11.7in;
        height: 8.3in;
        background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
        border: 0.2in solid #00FF7F;
        border-radius: 0.3in;
        padding: 0.5in;
        position: relative;
        overflow: hidden;
        font-family: Arial, sans-serif;
        color: white;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 25% 25%, #00FF7F10 0%, transparent 50%), radial-gradient(circle at 75% 75%, #0014A810 0%, transparent 50%);
          pointer-events: none;
        "></div>
        
        <div style="text-align: center; margin-bottom: 1in;">
          <div style="margin-bottom: 0.3in;">
            <div style="
              width: 1.5in;
              height: 1.5in;
              margin: 0 auto;
              background: linear-gradient(135deg, #00FF7F, #0014A8);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 0.5in rgba(0, 255, 127, 0.3);
            ">
              <span style="font-size: 0.8in; font-weight: bold; color: white;">FTLD</span>
            </div>
          </div>
          <h1 style="
            font-size: 0.8in;
            font-weight: bold;
            color: #00FF7F;
            margin: 0.2in 0;
            text-shadow: 0 0 0.1in rgba(0, 255, 127, 0.5);
          ">Certificate of Completion</h1>
          <div style="
            width: 3in;
            height: 0.05in;
            background: linear-gradient(90deg, #00FF7F, #0014A8);
            margin: 0.3in auto;
            border-radius: 0.025in;
          "></div>
        </div>
        
        <div style="text-align: center; margin-bottom: 1in;">
          <p style="font-size: 0.25in; color: #CCCCCC; margin-bottom: 0.2in;">This certifies that</p>
          <h2 style="
            font-size: 0.6in;
            font-weight: bold;
            color: white;
            margin: 0.3in 0;
            text-shadow: 0 0 0.1in rgba(255, 255, 255, 0.3);
          ">${cert.studentName}</h2>
          <p style="font-size: 0.25in; color: #CCCCCC; margin-bottom: 0.2in;">has successfully completed the</p>
          <h3 style="
            font-size: 0.4in;
            font-weight: bold;
            color: #00FF7F;
            margin: 0.3in 0;
            text-shadow: 0 0 0.1in rgba(0, 255, 127, 0.5);
          ">${cert.program}</h3>
          <p style="font-size: 0.25in; color: #CCCCCC;">
            program on ${new Date(cert.completionDate).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
        </div>
        
        <div style="
          position: absolute;
          bottom: 0.5in;
          left: 0.5in;
          right: 0.5in;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        ">
          <div style="text-align: left;">
            <p style="font-size: 0.15in; color: #00FF7F; font-weight: bold; margin-bottom: 0.1in;">Verification Code:</p>
            <div style="
              background: white;
              border: 0.02in solid #00FF7F;
              border-radius: 0.1in;
              padding: 0.15in;
              box-shadow: 0 0 0.1in rgba(0, 0, 0, 0.3);
            ">
              <p style="
                font-size: 0.25in;
                font-family: monospace;
                color: black;
                font-weight: bold;
                margin: 0;
                letter-spacing: 0.05in;
              ">${cert.verificationCode}</p>
            </div>
            <p style="font-size: 0.1in; color: #999999; margin-top: 0.1in;">Use this code to verify certificate authenticity</p>
          </div>
        </div>
        
        <div style="
          position: absolute;
          top: 50%;
          right: 1in;
          transform: translateY(-50%);
          text-align: center;
        ">
          <div style="
            width: 1.2in;
            height: 1.2in;
            border-radius: 50%;
            border: 0.05in solid #0014A8;
            background: radial-gradient(circle, #0014A820, #0014A810);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 0.2in rgba(0, 20, 168, 0.3);
          ">
            <span style="font-size: 0.4in; font-weight: bold; color: #00FF7F;">✔</span>
          </div>
          <p style="font-size: 0.1in; color: #00FF7F; font-weight: bold; margin-top: 0.1in; letter-spacing: 0.02in;">FTLD SEAL</p>
        </div>
      </div>
    `;

    document.body.appendChild(element);

    try {
      const opt = {
        margin: 0.5,
        filename: `FTLD_Certificate_${cert.studentName.replace(
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

      await html2pdf()
        .set(opt)
        .from(element.querySelector("#certificate-pdf"))
        .save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      document.body.removeChild(element);
    }
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
