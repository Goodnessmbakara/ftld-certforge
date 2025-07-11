"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import {
  Search,
  Download,
  Share2,
  Eye,
  Calendar,
  Award,
  Filter,
  Users,
  Sparkles,
  CheckCircle,
  XCircle,
} from "lucide-react";
import CertificatePreview from "@/components/CertificatePreview";

interface Certificate {
  id: string;
  studentName: string;
  program: string;
  completionDate: string;
  verificationCode: string;
  createdAt: string;
}

export default function StudentsPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<
    Certificate[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCertificateIds, setSelectedCertificateIds] = useState<
    Set<string>
  >(new Set());
  const [error, setError] = useState<string | null>(null);

  // Fetch real data from API
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/certificates");
        const result = await response.json();

        if (result.success) {
          setCertificates(result.certificates);
          setFilteredCertificates(result.certificates);
        } else {
          setError(result.error || "Failed to fetch certificates");
        }
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError("Failed to load certificates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Filter certificates based on search and program selection
  useEffect(() => {
    let filtered = certificates;

    if (searchTerm) {
      filtered = filtered.filter(
        (cert) =>
          cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.verificationCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedProgram) {
      filtered = filtered.filter((cert) => cert.program === selectedProgram);
    }

    setFilteredCertificates(filtered);
    // Reset selected certificates when filters change
    setSelectedCertificateIds(new Set());
  }, [searchTerm, selectedProgram, certificates]);

  const programs = [...new Set(certificates.map((cert) => cert.program))];

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowPreview(true);
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    // In a real implementation, you would use html2pdf.js or similar
    alert(
      `Downloading certificate for ${certificate.studentName} (Code: ${certificate.verificationCode})`
    );
  };

  const handleShareCertificate = (certificate: Certificate) => {
    const shareUrl = `${window.location.origin}/verify?code=${certificate.verificationCode}`;

    if (navigator.share) {
      navigator.share({
        title: `${certificate.studentName}'s Certificate`,
        text: `Check out this certificate from FTLD CertForge!`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Certificate link copied to clipboard!");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProgramColor = (program: string) => {
    if (program.includes("Smart Contract")) return "bg-[#00FF7F] text-black";
    if (program.includes("Future Program 1")) return "bg-[#0014A8] text-white";
    if (program.includes("Future Program 2")) return "bg-purple-600 text-white";
    return "bg-gray-600 text-white";
  };

  const handleSelectCertificate = (id: string, isSelected: boolean) => {
    setSelectedCertificateIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allIds = new Set(filteredCertificates.map((cert) => cert.id));
      setSelectedCertificateIds(allIds);
    } else {
      setSelectedCertificateIds(new Set());
    }
  };

  const handleBulkDownload = () => {
    if (selectedCertificateIds.size === 0) {
      alert("Please select at least one certificate to download.");
      return;
    }
    const selected = filteredCertificates.filter((cert) =>
      selectedCertificateIds.has(cert.id)
    );
    selected.forEach((cert) => handleDownloadCertificate(cert));
    alert(`Initiated download for ${selected.length} certificates.`);
    setSelectedCertificateIds(new Set()); // Clear selection after action
  };

  const handleBulkShare = () => {
    if (selectedCertificateIds.size === 0) {
      alert("Please select at least one certificate to share.");
      return;
    }
    const selected = filteredCertificates.filter((cert) =>
      selectedCertificateIds.has(cert.id)
    );
    const verificationCodes = selected
      .map((cert) => cert.verificationCode)
      .join(", ");
    const shareLinks = selected
      .map(
        (cert) =>
          `${window.location.origin}/verify?code=${cert.verificationCode}`
      )
      .join("\n");

    // Option 1: Copy all verification codes
    navigator.clipboard.writeText(verificationCodes);
    alert(
      `Copied verification codes for ${selected.length} certificates to clipboard: \n${verificationCodes}`
    );

    setSelectedCertificateIds(new Set()); // Clear selection after action
  };

  const allCertificatesSelected =
    filteredCertificates.length > 0 &&
    selectedCertificateIds.size === filteredCertificates.length;

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <div className="w-16 h-16 bg-[#00FF7F] rounded-full flex items-center justify-center mr-4 shadow-lg">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-5xl font-ultra font-bold bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent">
                Student Certificates
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-gill-sans">
              Browse, manage, and share certificates for all FTLD program
              graduates
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-[#00FF7F] transition-all duration-300">
              <div className="w-12 h-12 bg-[#00FF7F] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {certificates.length}
              </h3>
              <p className="text-gray-400">Total Certificates</p>
            </div>
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-[#0014A8] transition-all duration-300">
              <div className="w-12 h-12 bg-[#0014A8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {new Set(certificates.map((c) => c.studentName)).size}
              </h3>
              <p className="text-gray-400">Unique Students</p>
            </div>
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-[#00FF7F] transition-all duration-300">
              <div className="w-12 h-12 bg-[#00FF7F] rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {programs.length}
              </h3>
              <p className="text-gray-400">Active Programs</p>
            </div>
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-[#0014A8] transition-all duration-300">
              <div className="w-12 h-12 bg-[#0014A8] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">100%</h3>
              <p className="text-gray-400">Verified</p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-8 shadow-2xl">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or verification code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#00FF7F] focus:outline-none transition-all duration-300 text-base sm:text-lg"
                />
              </div>
              <div>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white focus:border-[#00FF7F] focus:outline-none transition-all duration-300 text-base sm:text-lg"
                >
                  <option value="">All Programs</option>
                  {programs.map((program) => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleBulkDownload}
                  disabled={selectedCertificateIds.size === 0}
                  className="flex-1 bg-gradient-to-r from-[#00FF7F] to-[#00FF7F]/80 text-black font-bold py-3 px-4 rounded-lg hover:from-[#00FF7F]/90 hover:to-[#00FF7F]/70 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-base sm:text-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Selected
                </button>
                <button
                  onClick={handleBulkShare}
                  disabled={selectedCertificateIds.size === 0}
                  className="flex-1 bg-gradient-to-r from-[#0014A8] to-[#0014A8]/80 text-white font-bold py-3 px-4 rounded-lg hover:from-[#0014A8]/90 hover:to-[#0014A8]/70 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-base sm:text-lg"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Selected
                </button>
              </div>
            </div>
          </div>

          {/* Certificates List */}
          <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-xl shadow-2xl overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32 sm:h-64">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#00FF7F]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Error Loading Certificates
                </h3>
                <p className="text-gray-400 mb-4 text-sm sm:text-base">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#00FF7F] text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-[#00FF7F]/80 transition-all duration-300 text-sm sm:text-base"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {/* Responsive Table View */}
                <div className="w-full overflow-x-auto">
                  <table className="min-w-[700px] w-full text-sm sm:text-base">
                    <thead>
                      <tr className="bg-gray-800 bg-opacity-50">
                        <th className="px-4 py-3 text-left font-bold text-[#00FF7F] whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={allCertificatesSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="w-4 h-4 text-[#00FF7F] bg-gray-700 border-gray-600 rounded focus:ring-[#00FF7F] focus:ring-2"
                          />
                        </th>
                        <th className="px-4 py-3 text-left font-bold text-[#00FF7F] whitespace-nowrap">
                          Student Name
                        </th>
                        <th className="px-4 py-3 text-left font-bold text-[#00FF7F] whitespace-nowrap">
                          Program
                        </th>
                        <th className="px-4 py-3 text-left font-bold text-[#00FF7F] whitespace-nowrap">
                          Completion Date
                        </th>
                        <th className="px-4 py-3 text-left font-bold text-[#00FF7F] whitespace-nowrap">
                          Verification Code
                        </th>
                        <th className="px-4 py-3 text-center font-bold text-[#00FF7F] whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredCertificates.map((certificate) => (
                        <tr
                          key={certificate.id}
                          className="hover:bg-gray-800 hover:bg-opacity-30 transition-all duration-300"
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedCertificateIds.has(
                                certificate.id
                              )}
                              onChange={(e) =>
                                handleSelectCertificate(
                                  certificate.id,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-[#00FF7F] bg-gray-700 border-gray-600 rounded focus:ring-[#00FF7F] focus:ring-2"
                            />
                          </td>
                          <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                            {certificate.studentName}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getProgramColor(
                                certificate.program
                              )}`}
                            >
                              {certificate.program}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                            {formatDate(certificate.completionDate)}
                          </td>
                          <td className="px-4 py-3 font-mono text-sm text-[#00FF7F] whitespace-nowrap">
                            {certificate.verificationCode}
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <div className="flex justify-center gap-2 sm:gap-3">
                              <button
                                onClick={() =>
                                  handleViewCertificate(certificate)
                                }
                                className="p-2 sm:p-2.5 text-gray-400 hover:text-[#00FF7F] hover:bg-[#00FF7F]/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00FF7F]"
                                title="View Certificate"
                              >
                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDownloadCertificate(certificate)
                                }
                                className="p-2 sm:p-2.5 text-gray-400 hover:text-[#00FF7F] hover:bg-[#00FF7F]/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00FF7F]"
                                title="Download Certificate"
                              >
                                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleShareCertificate(certificate)
                                }
                                className="p-2 sm:p-2.5 text-gray-400 hover:text-[#0014A8] hover:bg-[#0014A8]/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0014A8]"
                                title="Share Certificate"
                              >
                                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredCertificates.length === 0 && !isLoading && !error && (
                  <div className="text-center py-8 sm:py-12 px-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base">
                      No certificates found matching your criteria
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showPreview && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-2 sm:p-8 overflow-auto">
          <div className="bg-gray-900 rounded-xl p-2 sm:p-8 max-w-full max-h-full overflow-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-2xl"
              onClick={() => setShowPreview(false)}
            >
              &times;
            </button>
            <CertificatePreview certificate={selectedCertificate} />
          </div>
        </div>
      )}
    </div>
  );
}
