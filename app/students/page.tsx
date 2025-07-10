"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import { Search, Download, Share2, Eye, Calendar, Award, Filter } from "lucide-react"
import CertificatePreview from "@/components/CertificatePreview"

interface Certificate {
  id: string
  studentName: string
  program: string
  completionDate: string
  verificationCode: string
  createdAt: string
}

export default function StudentsPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedCertificateIds, setSelectedCertificateIds] = useState<Set<string>>(new Set())

  // Mock data - in production, this would come from your API
  useEffect(() => {
    const mockCertificates: Certificate[] = [
      {
        id: "1",
        studentName: "Alice Johnson",
        program: "Smart Contract Training (Lisk)",
        completionDate: "2024-01-15",
        verificationCode: "FTLD-ABC1-XYZ9",
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        studentName: "Bob Smith",
        program: "Smart Contract Training (Lisk)",
        completionDate: "2024-01-20",
        verificationCode: "FTLD-DEF2-UVW8",
        createdAt: "2024-01-20T14:45:00Z",
      },
      {
        id: "3",
        studentName: "Carol Davis",
        program: "Future Program 1",
        completionDate: "2024-02-01",
        verificationCode: "FTLD-GHI3-RST7",
        createdAt: "2024-02-01T09:15:00Z",
      },
      {
        id: "4",
        studentName: "David Wilson",
        program: "Smart Contract Training (Lisk)",
        completionDate: "2024-02-10",
        verificationCode: "FTLD-JKL4-OPQ6",
        createdAt: "2024-02-10T16:20:00Z",
      },
      {
        id: "5",
        studentName: "Eva Martinez",
        program: "Future Program 2",
        completionDate: "2024-02-15",
        verificationCode: "FTLD-MNO5-LMN5",
        createdAt: "2024-02-15T11:30:00Z",
      },
    ]

    setTimeout(() => {
      setCertificates(mockCertificates)
      setFilteredCertificates(mockCertificates)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter certificates based on search and program selection
  useEffect(() => {
    let filtered = certificates

    if (searchTerm) {
      filtered = filtered.filter(
        (cert) =>
          cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.verificationCode.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedProgram) {
      filtered = filtered.filter((cert) => cert.program === selectedProgram)
    }

    setFilteredCertificates(filtered)
    // Reset selected certificates when filters change
    setSelectedCertificateIds(new Set())
  }, [searchTerm, selectedProgram, certificates])

  const programs = [...new Set(certificates.map((cert) => cert.program))]

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate)
    setShowPreview(true)
  }

  const handleDownloadCertificate = (certificate: Certificate) => {
    // In a real implementation, you would use html2pdf.js or similar
    alert(`Downloading certificate for ${certificate.studentName} (Code: ${certificate.verificationCode})`)
  }

  const handleShareCertificate = (certificate: Certificate) => {
    const shareUrl = `${window.location.origin}/verify?code=${certificate.verificationCode}`

    if (navigator.share) {
      navigator.share({
        title: `${certificate.studentName}'s Certificate`,
        text: `Check out this certificate from FTLD CertForge!`,
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert("Certificate link copied to clipboard!")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getProgramColor = (program: string) => {
    if (program.includes("Smart Contract")) return "bg-green-500"
    if (program.includes("Future Program 1")) return "bg-blue-500"
    if (program.includes("Future Program 2")) return "bg-purple-500"
    return "bg-gray-500"
  }

  const handleSelectCertificate = (id: string, isSelected: boolean) => {
    setSelectedCertificateIds((prev) => {
      const newSet = new Set(prev)
      if (isSelected) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allIds = new Set(filteredCertificates.map((cert) => cert.id))
      setSelectedCertificateIds(allIds)
    } else {
      setSelectedCertificateIds(new Set())
    }
  }

  const handleBulkDownload = () => {
    if (selectedCertificateIds.size === 0) {
      alert("Please select at least one certificate to download.")
      return
    }
    const selected = filteredCertificates.filter((cert) => selectedCertificateIds.has(cert.id))
    selected.forEach((cert) => handleDownloadCertificate(cert))
    alert(`Initiated download for ${selected.length} certificates.`)
    setSelectedCertificateIds(new Set()) // Clear selection after action
  }

  const handleBulkShare = () => {
    if (selectedCertificateIds.size === 0) {
      alert("Please select at least one certificate to share.")
      return
    }
    const selected = filteredCertificates.filter((cert) => selectedCertificateIds.has(cert.id))
    const verificationCodes = selected.map((cert) => cert.verificationCode).join(", ")
    const shareLinks = selected
      .map((cert) => `${window.location.origin}/verify?code=${cert.verificationCode}`)
      .join("\n")

    // Option 1: Copy all verification codes
    navigator.clipboard.writeText(verificationCodes)
    alert(`Copied verification codes for ${selected.length} certificates to clipboard: \n${verificationCodes}`)

    // Option 2: Open multiple share dialogs (can be annoying)
    // selected.forEach((cert) => handleShareCertificate(cert));

    // Option 3: Copy all share links
    // navigator.clipboard.writeText(shareLinks);
    // alert(`Copied share links for ${selected.length} certificates to clipboard.`);

    setSelectedCertificateIds(new Set()) // Clear selection after action
  }

  const allCertificatesSelected =
    filteredCertificates.length > 0 && selectedCertificateIds.size === filteredCertificates.length
  const someCertificatesSelected = selectedCertificateIds.size > 0 && !allCertificatesSelected

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Student Certificates</h1>
            <p className="text-xl text-gray-400">View and manage all issued certificates</p>
          </div>

          {/* Search and Filter Controls */}
          <div className="card mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student name or verification code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="input-field pl-10 pr-8 min-w-[200px]"
                >
                  <option value="">All Programs</option>
                  {programs.map((program) => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-400">
                {filteredCertificates.length} of {certificates.length} certificates
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-green-400">{certificates.length}</h3>
              <p className="text-gray-400">Total Certificates</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-blue-400">
                {certificates.filter((c) => c.program.includes("Smart Contract")).length}
              </h3>
              <p className="text-gray-400">Smart Contract</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-purple-400">{new Date().getMonth() + 1}</h3>
              <p className="text-gray-400">This Month</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-400">{programs.length}</h3>
              <p className="text-gray-400">Programs</p>
            </div>
          </div>

          {/* Bulk Actions */}
          {filteredCertificates.length > 0 && (
            <div className="card mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={allCertificatesSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-green-400 rounded border-gray-600 bg-gray-700 focus:ring-green-400"
                />
                <label htmlFor="selectAll" className="text-gray-300">
                  Select All ({selectedCertificateIds.size} selected)
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleBulkDownload}
                  disabled={selectedCertificateIds.size === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Selected</span>
                </button>
                <button
                  onClick={handleBulkShare}
                  disabled={selectedCertificateIds.size === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Selected</span>
                </button>
              </div>
            </div>
          )}

          {/* Certificates List */}
          {isLoading ? (
            <div className="card">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
                <span className="ml-4 text-gray-400">Loading certificates...</span>
              </div>
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">No certificates found</h3>
              <p className="text-gray-400">
                {searchTerm || selectedProgram
                  ? "Try adjusting your search criteria"
                  : "No certificates have been issued yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCertificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="card hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedCertificateIds.has(certificate.id)}
                        onChange={(e) => handleSelectCertificate(certificate.id, e.target.checked)}
                        className="form-checkbox h-5 w-5 text-green-400 rounded border-gray-600 bg-gray-700 focus:ring-green-400"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{certificate.studentName}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getProgramColor(certificate.program)}`}
                          >
                            {certificate.program.split(" ")[0]} {certificate.program.split(" ")[1]}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
                          <div>
                            <span className="font-medium">Program:</span>
                            <p className="text-white">{certificate.program}</p>
                          </div>
                          <div>
                            <span className="font-medium">Completed:</span>
                            <p className="text-white">{formatDate(certificate.completionDate)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Verification Code:</span>
                            <p className="text-white font-mono">{certificate.verificationCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 md:mt-0">
                      <button
                        onClick={() => handleViewCertificate(certificate)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        title="View Certificate"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>

                      <button
                        onClick={() => handleDownloadCertificate(certificate)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </button>

                      <button
                        onClick={() => handleShareCertificate(certificate)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        title="Share Certificate"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showPreview && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Certificate Preview</h2>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white text-2xl">
                ×
              </button>
            </div>

            <CertificatePreview certificate={selectedCertificate} />
          </div>
        </div>
      )}
    </div>
  )
}
