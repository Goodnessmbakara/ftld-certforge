"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CertificatePreview from "@/components/CertificatePreview";
import ProgressBar from "@/components/ProgressBar";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Sparkles,
  Award,
  Users,
  Zap,
} from "lucide-react";
import { useAlchemyWallet } from "../../hooks/useAlchemyWallet";

interface CertificateData {
  studentName: string;
  program: string;
  completionDate: string;
}

interface Stats {
  totalCertificates: number;
  activePrograms: number;
  successRate: number;
}

export default function AdminDashboard() {
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
  const {
    walletAddress,
    loading: walletLoading,
    error: walletError,
  } = useAlchemyWallet();

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateCertificate = async () => {
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

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const response = await fetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.success) {
        setCertificate(result.certificate);
        // Update stats
        setStats((prev) => ({
          ...prev,
          totalCertificates: prev.totalCertificates + 1,
        }));
      } else {
        alert(`Failed to generate certificate: ${result.error}`);
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("An unexpected error occurred during certificate generation.");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBulkUploadFile(e.target.files[0]);
      setBulkUploadResult(null); // Clear previous results
    }
  };

  const handleBulkGenerate = async () => {
    if (!bulkUploadFile) {
      alert("Please select an Excel/CSV file to upload.");
      return;
    }

    setIsBulkUploading(true);
    setBulkUploadProgress(0);
    setBulkUploadResult(null);

    try {
      // For demo purposes, we'll use mock data
      // In a real implementation, you would parse the actual file
      const mockParsedData: CertificateData[] = [
        {
          studentName: "Jane Doe",
          program: "Smart Contract Training (Lisk)",
          completionDate: "2024-03-01",
        },
        {
          studentName: "Peter Jones",
          program: "Future Program 1",
          completionDate: "2024-03-05",
        },
        {
          studentName: "Sarah Lee",
          program: "Smart Contract Training (Lisk)",
          completionDate: "2024-03-10",
        },
        {
          studentName: "Invalid Entry",
          program: "Non-existent Program",
          completionDate: "2024-03-15",
        }, // Simulate an error
      ];

      const totalRecords = mockParsedData.length;
      let successfulCreations = 0;
      let failedCreations = 0;
      const errors: string[] = [];

      for (let i = 0; i < totalRecords; i++) {
        const record = mockParsedData[i];
        setBulkUploadProgress(Math.floor(((i + 1) / totalRecords) * 100));

        try {
          const response = await fetch("/api/certificates/bulk-create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify([record]), // Send one by one for demo, or send batch
          });
          const result = await response.json();

          if (result.success) {
            successfulCreations += result.results.filter(
              (r: any) => r.success
            ).length;
            failedCreations += result.results.filter(
              (r: any) => !r.success
            ).length;
            errors.push(...result.summary.errors);
          } else {
            failedCreations++;
            errors.push(
              `Record ${i + 1} (${record.studentName}): ${
                result.error || "Unknown error"
              }`
            );
          }
        } catch (error: any) {
          failedCreations++;
          errors.push(
            `Record ${i + 1} (${record.studentName}): ${
              error.message || "Network error"
            }`
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate processing time
      }

      setBulkUploadResult({
        success: successfulCreations,
        failed: failedCreations,
        errors,
      });

      // Update stats if successful
      if (successfulCreations > 0) {
        setStats((prev) => ({
          ...prev,
          totalCertificates: prev.totalCertificates + successfulCreations,
        }));
      }
    } catch (error) {
      console.error("Error in bulk upload:", error);
      setBulkUploadResult({
        success: 0,
        failed: 1,
        errors: ["Bulk upload failed"],
      });
    } finally {
      setIsBulkUploading(false);
      setBulkUploadProgress(0);
      setBulkUploadFile(null); // Clear file input
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16">
        <div className="max-w-5xl mx-auto">
          {/* User Smart Wallet Info */}
          <div className="mb-8">
            <h2 className="text-xl font-ultra font-bold mb-2">
              Your Smart Wallet
            </h2>
            {walletLoading && (
              <p className="text-gray-400">Loading wallet...</p>
            )}
            {walletError && <p className="text-red-500">{walletError}</p>}
            {walletAddress && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col gap-2">
                <span className="text-gray-400 text-sm">Wallet Address:</span>
                <code className="break-all text-green-400 font-mono">
                  {walletAddress}
                </code>
              </div>
            )}
          </div>
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <div className="w-16 h-16 bg-[#00FF7F] rounded-full flex items-center justify-center mr-4 shadow-lg">
                <Award className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-5xl font-ultra font-bold bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-gill-sans">
              Generate and manage certificates for FTLD program completions with
              our powerful admin tools
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-[#00FF7F] transition-all duration-300">
              <div className="w-12 h-12 bg-[#00FF7F] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-ultra font-bold text-white mb-2">
                {stats.totalCertificates}+
              </h3>
              <p className="text-gray-400 font-gill-sans">
                Certificates Generated
              </p>
            </div>
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-[#0014A8] transition-all duration-300">
              <div className="w-12 h-12 bg-[#0014A8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-ultra font-bold text-white mb-2">
                {stats.activePrograms}
              </h3>
              <p className="text-gray-400 font-gill-sans">Active Programs</p>
            </div>
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-[#00FF7F] transition-all duration-300">
              <div className="w-12 h-12 bg-[#00FF7F] rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-ultra font-bold text-white mb-2">
                {stats.successRate}%
              </h3>
              <p className="text-gray-400 font-gill-sans">Success Rate</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Certificate Generation Form */}
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 sm:p-10 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-[#00FF7F] rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-2xl font-ultra font-bold text-white">
                  Single Certificate Generation
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="studentName"
                    className="block text-sm font-medium mb-2 text-[#00FF7F]"
                  >
                    Student Name *
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="Enter student's full name"
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#00FF7F] focus:outline-none transition-all duration-300 text-base sm:text-lg"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="program"
                    className="block text-sm font-medium mb-2 text-[#00FF7F]"
                  >
                    Program *
                  </label>
                  <select
                    id="program"
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white focus:border-[#00FF7F] focus:outline-none transition-all duration-300 text-base sm:text-lg"
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
                  <label
                    htmlFor="completionDate"
                    className="block text-sm font-medium mb-2 text-[#00FF7F]"
                  >
                    Completion Date *
                  </label>
                  <input
                    type="date"
                    id="completionDate"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white focus:border-[#00FF7F] focus:outline-none transition-all duration-300 text-base sm:text-lg"
                    required
                  />
                </div>

                <button
                  onClick={generateCertificate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-[#00FF7F] to-[#00FF7F]/80 text-black font-bold py-4 px-6 rounded-lg hover:from-[#00FF7F]/90 hover:to-[#00FF7F]/70 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-base sm:text-lg"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Generating Certificate...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Award className="w-5 h-5 mr-2" />
                      Generate Certificate
                    </div>
                  )}
                </button>

                {isGenerating && <ProgressBar progress={progress} />}
              </div>
            </div>

            {/* Bulk Upload Section */}
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 sm:p-10 shadow-2xl overflow-x-auto">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-[#0014A8] rounded-lg flex items-center justify-center mr-3">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-ultra font-bold text-white">
                  Bulk Certificate Generation
                </h2>
              </div>

              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#0014A8] transition-all duration-300">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    Upload Excel/CSV file with student data
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-[#0014A8] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0014A8]/80 transition-all duration-300 cursor-pointer inline-block text-base sm:text-lg"
                  >
                    Choose File
                  </label>
                  {bulkUploadFile && (
                    <p className="text-[#00FF7F] mt-2">
                      Selected: {bulkUploadFile.name}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleBulkGenerate}
                  disabled={isBulkUploading || !bulkUploadFile}
                  className="w-full bg-gradient-to-r from-[#0014A8] to-[#0014A8]/80 text-white font-bold py-4 px-6 rounded-lg hover:from-[#0014A8]/90 hover:to-[#0014A8]/70 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-base sm:text-lg"
                >
                  {isBulkUploading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Process Bulk Upload"
                  )}
                </button>

                {isBulkUploading && (
                  <ProgressBar progress={bulkUploadProgress} />
                )}

                {bulkUploadResult && (
                  <div className="mt-6 p-4 rounded-lg border-2 border-[#00FF7F] bg-[#00FF7F]/10 overflow-x-auto">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-[#00FF7F] mr-2" />
                      <span className="font-bold text-[#00FF7F]">
                        Bulk Upload Complete
                      </span>
                    </div>
                    <p className="text-white">
                      Successfully created {bulkUploadResult.success}{" "}
                      certificates
                    </p>
                    {bulkUploadResult.failed > 0 && (
                      <p className="text-red-400">
                        Failed to create {bulkUploadResult.failed} certificates
                      </p>
                    )}
                    {bulkUploadResult.errors.length > 0 && (
                      <details className="mt-2">
                        <summary className="text-sm text-gray-400 cursor-pointer">
                          View Errors
                        </summary>
                        <ul className="mt-2 text-xs text-red-400 space-y-1">
                          {bulkUploadResult.errors
                            .slice(0, 5)
                            .map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                          {bulkUploadResult.errors.length > 5 && (
                            <li>
                              ... and {bulkUploadResult.errors.length - 5} more
                              errors
                            </li>
                          )}
                        </ul>
                      </details>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Certificate Preview */}
          {certificate && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Generated Certificate
                </h2>
                <p className="text-gray-400">
                  Preview and download the generated certificate
                </p>
              </div>
              <CertificatePreview certificate={certificate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
