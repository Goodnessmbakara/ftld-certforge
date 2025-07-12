"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Award,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface Certificate {
  id: string;
  studentName: string;
  program: string;
  completionDate: string;
  verificationCode: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export default function StudentsPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  });
  const [programs, setPrograms] = useState<string[]>([]);

  useEffect(() => {
    fetchCertificates();
    fetchPrograms();
  }, [searchTerm, selectedProgram, pagination.offset]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (selectedProgram) {
        params.append("program", selectedProgram);
      }

      const response = await fetch(`/api/students?${params}`);
      const data = await response.json();

      if (data.success) {
        setCertificates(data.certificates);
        setPagination(data.pagination);
      } else {
        console.error("Failed to fetch certificates:", data.error);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/programs");
      const data = await response.json();

      if (data.success) {
        setPrograms(data.programs.map((p: { name: string }) => p.name));
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, offset: 0 }));
  };

  const handleProgramFilter = (program: string) => {
    setSelectedProgram(program);
    setPagination((prev) => ({ ...prev, offset: 0 }));
  };

  const loadMore = () => {
    setPagination((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  };

  const downloadCertificate = (cert: Certificate) => {
    const certificateData = {
      studentName: cert.studentName,
      program: cert.program,
      completionDate: cert.completionDate,
      verificationCode: cert.verificationCode,
    };

    const blob = new Blob([JSON.stringify(certificateData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificate-${cert.studentName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const viewCertificate = (cert: Certificate) => {
    window.open(`/verify?code=${cert.verificationCode}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-ultra font-bold mb-4">
            <span className="text-white">Student</span>
            <br />
            <span className="bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent">
              Certificates
            </span>
          </h1>
          <p className="text-xl text-gray-400 font-gill-sans">
            View and manage all issued certificates
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 font-gill-sans">
                  Total Certificates
                </p>
                <p className="text-3xl font-bold text-white">
                  {pagination.total}
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
                  {programs.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#0014A8]/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#0014A8]" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 font-gill-sans">This Month</p>
                <p className="text-3xl font-bold text-white">
                  {
                    certificates.filter(
                      (cert) =>
                        new Date(cert.createdAt).getMonth() ===
                        new Date().getMonth()
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-[#00FF7F]/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#00FF7F]" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student name or verification code..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-[#00FF7F] focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedProgram}
                onChange={(e) => handleProgramFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#0014A8] focus:outline-none transition-colors"
              >
                <option value="">All Programs</option>
                {programs.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="bg-[#00FF7F] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#00CC66] transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Certificates Table */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Program
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Completion Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Verification Code
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      Loading certificates...
                    </td>
                  </tr>
                ) : certificates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      No certificates found
                    </td>
                  </tr>
                ) : (
                  certificates.map((cert) => (
                    <tr
                      key={cert.id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">
                        {cert.studentName}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {cert.program}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(cert.completionDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm text-[#00FF7F] font-mono">
                          {cert.verificationCode}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewCertificate(cert)}
                            className="bg-[#0014A8] text-white p-2 rounded-lg hover:bg-[#000080] transition-colors"
                            title="View Certificate"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadCertificate(cert)}
                            className="bg-[#00FF7F] text-black p-2 rounded-lg hover:bg-[#00CC66] transition-colors"
                            title="Download Certificate"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Load More */}
          {pagination.hasMore && (
            <div className="p-6 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-[#00FF7F] text-black font-bold px-8 py-3 rounded-xl hover:bg-[#00CC66] transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
