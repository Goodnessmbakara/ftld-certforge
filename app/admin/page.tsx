"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import {
  Award,
  Upload,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Download,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useUserContext } from "../../contexts/UserContext";
import { useUser } from "@supabase/auth-helpers-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface Stats {
  totalCertificates: number;
  activePrograms: number;
  successRate: number;
}

interface Certificate {
  id: string;
  studentName: string;
  program: string;
  completionDate: string;
  verificationCode: string;
}

export default function AdminDashboard() {
  const { user, displayName, role, loading } = useUserContext();
  const supabaseUser = useUser();
  const [formData, setFormData] = useState({
    studentName: "",
    program: "",
    completionDate: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [certificate, setCertificate] = useState(null);
  const [stats, setStats] = useState<Stats>({
    totalCertificates: 0,
    activePrograms: 0,
    successRate: 99.9,
  });

  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const [bulkUploadResult, setBulkUploadResult] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [programs, setPrograms] = useState<string[]>([]);

  useEffect(() => {
    // Fetch programs and stats from API
    const fetchData = async () => {
      try {
        // Fetch programs
        const programsResponse = await fetch("/api/programs");
        const programsData = await programsResponse.json();
        if (programsData.success) {
          setPrograms(
            programsData.programs.map((p: { name: string }) => p.name)
          );
        } else {
          console.error("Failed to fetch programs:", programsData.error);
        }

        // Fetch stats (certificates count)
        const studentsResponse = await fetch("/api/certificates");
        const studentsData = await studentsResponse.json();
        if (studentsData.success) {
          setStats({
            totalCertificates: studentsData.certificates.length,
            activePrograms: programsData.success
              ? programsData.programs.length
              : 0,
            successRate: 99.9,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.studentName ||
      !formData.program ||
      !formData.completionDate
    ) {
      alert("Please fill in all fields");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCertificate(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const jwt =
        supabaseUser?.access_token ||
        (supabaseUser?.session?.access_token ?? "");
      const response = await fetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setProgress(100);
        setCertificate(result.certificate);
        setFormData({
          studentName: "",
          program: "",
          completionDate: "",
        });
        // Update stats
        setStats((prev) => ({
          ...prev,
          totalCertificates: prev.totalCertificates + 1,
        }));
      } else {
        throw new Error(result.error || "Failed to generate certificate");
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Failed to generate certificate. Please try again.");
    } finally {
      setIsGenerating(false);
      clearInterval(progressInterval);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkUploadFile) {
      alert("Please select a file");
      return;
    }

    setIsBulkUploading(true);
    setBulkUploadProgress(0);
    setBulkUploadResult(null);

    // Simulate bulk upload progress
    const progressInterval = setInterval(() => {
      setBulkUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 5;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append("file", bulkUploadFile);

      const response = await fetch("/api/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setBulkUploadProgress(100);
        setBulkUploadResult(result);
        setBulkUploadFile(null);
        // Update stats
        setStats((prev) => ({
          ...prev,
          totalCertificates: prev.totalCertificates + result.success,
        }));
      } else {
        throw new Error(result.error || "Failed to upload certificates");
      }
    } catch (error) {
      console.error("Error uploading certificates:", error);
      setBulkUploadResult({
        success: 0,
        failed: 1,
        errors: ["Failed to upload certificates. Please try again."],
      });
    } finally {
      setIsBulkUploading(false);
      clearInterval(progressInterval);
    }
  };

  const downloadCertificate = async (cert: any) => {
    // Create a temporary certificate element for PDF generation
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `
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

    document.body.appendChild(tempDiv);

    try {
      const html2pdf = (await import("html2pdf.js")).default;

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
        .from(tempDiv.querySelector("#certificate-pdf"))
        .save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  if (loading) {
    return <div className="text-center text-white py-12">Loading...</div>;
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Header />
        <div className="flex flex-col items-center justify-center mt-16 p-8 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl max-w-md w-full">
          <div className="mb-4">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="#00FF7F"
                fillOpacity="0.15"
              />
              <path
                d="M12 8v4m0 4h.01"
                stroke="#00FF7F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-300 mb-4 text-center max-w-xs">
            Please sign in to access the admin dashboard.
          </p>
          <a
            href="/"
            className="inline-block mt-2 px-6 py-2 bg-gradient-to-r from-[#00FF7F] to-[#0014A8] text-white font-bold rounded-xl shadow hover:from-[#0014A8] hover:to-[#00FF7F] transition-all"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Header />
        <div className="flex flex-col items-center justify-center mt-16 p-8 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl max-w-md w-full">
          <div className="mb-4">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="#00FF7F"
                fillOpacity="0.15"
              />
              <path
                d="M12 8v4m0 4h.01"
                stroke="#00FF7F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Admin Access Required
          </h2>
          <p className="text-gray-300 mb-4 text-center max-w-xs">
            Hello {displayName || "User"}, you don't have admin privileges.
            <br />
            Only FTLD CertForge admins can generate certificates.
            <br />
            If you believe you should have access, please contact your program
            administrator or support.
          </p>
          <a
            href="/"
            className="inline-block mt-2 px-6 py-2 bg-gradient-to-r from-[#00FF7F] to-[#0014A8] text-white font-bold rounded-xl shadow hover:from-[#0014A8] hover:to-[#00FF7F] transition-all"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-ultra font-bold mb-4">
            <span className="text-white">Admin</span>
            <br />
            <span className="bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-400 font-gill-sans mb-2">
            Generate and manage blockchain certificates
          </p>
          <p className="text-lg text-[#00FF7F] font-gill-sans">
            Welcome back, {displayName || "Admin"}! 👋
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 font-gill-sans">
                  Total Certificates
                </p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalCertificates}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#00FF7F]/20 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-[#00FF7F]" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 font-gill-sans">Active Programs</p>
                <p className="text-3xl font-bold text-white">
                  {stats.activePrograms}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#0014A8]/20 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#0014A8]" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 font-gill-sans">Success Rate</p>
                <p className="text-3xl font-bold text-white">
                  {stats.successRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-[#00FF7F]/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#00FF7F]" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generate Certificate Form */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-ultra font-bold text-white mb-6 flex items-center gap-3">
              <Plus className="w-6 h-6 text-[#00FF7F]" />
              Generate Certificate
            </h2>

            <form onSubmit={generateCertificate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#00FF7F] focus:outline-none transition-colors"
                  placeholder="Enter student name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Program
                </label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#00FF7F] focus:outline-none transition-colors"
                  required
                >
                  <option value="">Select a program</option>
                  {programs.map((program) => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Completion Date
                </label>
                <input
                  type="date"
                  name="completionDate"
                  value={formData.completionDate}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#00FF7F] focus:outline-none transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-[#00FF7F] to-[#00CC66] text-black font-bold py-4 px-6 rounded-xl hover:from-[#00CC66] hover:to-[#00FF7F] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Generating Certificate...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Certificate
                  </div>
                )}
              </button>
            </form>

            {/* Progress Bar */}
            {isGenerating && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Generating...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00FF7F] to-[#00CC66] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Generated Certificate */}
            {certificate && (
              <div className="mt-6 p-4 bg-[#00FF7F]/10 border border-[#00FF7F]/30 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">
                    Certificate Generated!
                  </h3>
                  <CheckCircle className="w-6 h-6 text-[#00FF7F]" />
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400">Student:</span>{" "}
                    {certificate.studentName}
                  </p>
                  <p>
                    <span className="text-gray-400">Program:</span>{" "}
                    {certificate.program}
                  </p>
                  <p>
                    <span className="text-gray-400">Verification Code:</span>{" "}
                    {certificate.verificationCode}
                  </p>
                </div>
                <button
                  onClick={() => downloadCertificate(certificate)}
                  className="mt-4 w-full bg-[#00FF7F] text-black font-bold py-2 px-4 rounded-lg hover:bg-[#00CC66] transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </button>
              </div>
            )}
          </div>

          {/* Bulk Upload */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-ultra font-bold text-white mb-6 flex items-center gap-3">
              <Upload className="w-6 h-6 text-[#0014A8]" />
              Bulk Upload
            </h2>

            <form onSubmit={handleBulkUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) =>
                    setBulkUploadFile(e.target.files?.[0] || null)
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#0014A8] focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">
                  CSV should contain: student_name, program, completion_date
                </p>
              </div>

              <button
                type="submit"
                disabled={isBulkUploading || !bulkUploadFile}
                className="w-full bg-gradient-to-r from-[#0014A8] to-[#000080] text-white font-bold py-4 px-6 rounded-xl hover:from-[#000080] hover:to-[#0014A8] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {isBulkUploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Certificates
                  </div>
                )}
              </button>
            </form>

            {/* Upload Progress */}
            {isBulkUploading && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Uploading...</span>
                  <span>{bulkUploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0014A8] to-[#000080] transition-all duration-300 ease-out"
                    style={{ width: `${bulkUploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Upload Result */}
            {bulkUploadResult && (
              <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">
                    Upload Complete
                  </h3>
                  {bulkUploadResult.failed === 0 ? (
                    <CheckCircle className="w-6 h-6 text-[#00FF7F]" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400">Successful:</span>{" "}
                    <span className="text-[#00FF7F]">
                      {bulkUploadResult.success}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">Failed:</span>{" "}
                    <span className="text-red-400">
                      {bulkUploadResult.failed}
                    </span>
                  </p>
                </div>
                {bulkUploadResult.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-400 mb-2">Errors:</p>
                    <ul className="text-xs text-red-400 space-y-1">
                      {bulkUploadResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
