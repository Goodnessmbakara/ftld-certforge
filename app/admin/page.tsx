"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import CertificatePreview from "@/components/CertificatePreview"
import ProgressBar from "@/components/ProgressBar"
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react"

interface CertificateData {
  studentName: string
  program: string
  completionDate: string
}

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    studentName: "",
    program: "",
    completionDate: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [certificate, setCertificate] = useState(null)

  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null)
  const [isBulkUploading, setIsBulkUploading] = useState(false)
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0)
  const [bulkUploadResult, setBulkUploadResult] = useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)
  const [programs, setPrograms] = useState<string[]>([])

  useEffect(() => {
    // Fetch programs from API
    const fetchPrograms = async () => {
      try {
        const response = await fetch("/api/programs")
        const data = await response.json()
        if (data.success) {
          setPrograms(data.programs.map((p: { name: string }) => p.name))
        } else {
          console.error("Failed to fetch programs:", data.error)
        }
      } catch (error) {
        console.error("Error fetching programs:", error)
      }
    }
    fetchPrograms()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const generateCertificate = async () => {
    if (!formData.studentName || !formData.program || !formData.completionDate) {
      alert("Please fill in all fields")
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setCertificate(null)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 10
      })
    }, 100)

    try {
      const response = await fetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const result = await response.json()

      if (result.success) {
        setCertificate(result.certificate)
      } else {
        alert(`Failed to generate certificate: ${result.error}`)
      }
    } catch (error) {
      console.error("Error generating certificate:", error)
      alert("An unexpected error occurred during certificate generation.")
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBulkUploadFile(e.target.files[0])
      setBulkUploadResult(null) // Clear previous results
    }
  }

  const handleBulkGenerate = async () => {
    if (!bulkUploadFile) {
      alert("Please select an Excel/CSV file to upload.")
      return
    }

    setIsBulkUploading(true)
    setBulkUploadProgress(0)
    setBulkUploadResult(null)

    // Simulate file parsing and data extraction
    // In a real app, you'd use a library like 'xlsx' here
    // For this demo, we'll use mock data
    const mockParsedData: CertificateData[] = [
      { studentName: "Jane Doe", program: "Smart Contract Training (Lisk)", completionDate: "2024-03-01" },
      { studentName: "Peter Jones", program: "Future Program 1", completionDate: "2024-03-05" },
      { studentName: "Sarah Lee", program: "Smart Contract Training (Lisk)", completionDate: "2024-03-10" },
      { studentName: "Invalid Entry", program: "Non-existent Program", completionDate: "2024-03-15" }, // Simulate an error
    ]

    const totalRecords = mockParsedData.length
    let successfulCreations = 0
    let failedCreations = 0
    const errors: string[] = []

    for (let i = 0; i < totalRecords; i++) {
      const record = mockParsedData[i]
      setBulkUploadProgress(Math.floor(((i + 1) / totalRecords) * 100))

      try {
        const response = await fetch("/api/certificates/bulk-create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([record]), // Send one by one for demo, or send batch
        })
        const result = await response.json()

        if (result.success) {
          successfulCreations += result.certificates.length
        } else {
          failedCreations++
          errors.push(`Record ${i + 1} (${record.studentName}): ${result.error || "Unknown error"}`)
        }
      } catch (error: any) {
        failedCreations++
        errors.push(`Record ${i + 1} (${record.studentName}): ${error.message || "Network error"}`)
      }
      await new Promise((resolve) => setTimeout(resolve, 200)) // Simulate processing time
    }

    setBulkUploadResult({ success: successfulCreations, failed: failedCreations, errors })
    setIsBulkUploading(false)
    setBulkUploadProgress(0)
    setBulkUploadFile(null) // Clear file input
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-xl text-gray-400">Generate certificates for FTLD program completions</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Certificate Generation Form */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Single Certificate Generation</h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="Enter student's full name"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="program" className="block text-sm font-medium mb-2">
                    Program *
                  </label>
                  <select
                    id="program"
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    className="input-field"
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
                  <label htmlFor="completionDate" className="block text-sm font-medium mb-2">
                    Completion Date *
                  </label>
                  <input
                    type="date"
                    id="completionDate"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Generating certificate...</p>
                    <ProgressBar progress={progress} />
                  </div>
                )}

                <button
                  onClick={generateCertificate}
                  disabled={isGenerating}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? "Generating..." : "Generate Certificate"}
                </button>
              </div>
            </div>

            {/* Bulk Certificate Generation */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Bulk Certificate Generation</h2>
              <p className="text-gray-400 mb-4">Upload an Excel/CSV file with student details.</p>

              <div className="space-y-6">
                <div>
                  <label htmlFor="bulkUpload" className="block text-sm font-medium mb-2">
                    Upload File (.csv, .xlsx)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      id="bulkUpload"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="bulkUpload"
                      className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {bulkUploadFile ? bulkUploadFile.name : "Choose File"}
                    </label>
                    {bulkUploadFile && (
                      <button
                        onClick={() => setBulkUploadFile(null)}
                        className="text-red-400 hover:text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Expected columns: `studentName`, `program`, `completionDate` (YYYY-MM-DD)
                  </p>
                </div>

                {isBulkUploading && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Processing file...</p>
                    <ProgressBar progress={bulkUploadProgress} />
                  </div>
                )}

                <button
                  onClick={handleBulkGenerate}
                  disabled={!bulkUploadFile || isBulkUploading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBulkUploading ? "Processing..." : "Generate Certificates from File"}
                </button>

                {bulkUploadResult && (
                  <div
                    className={`mt-4 p-4 rounded-lg ${
                      bulkUploadResult.failed === 0
                        ? "bg-green-500/10 border-green-500"
                        : "bg-red-500/10 border-red-500"
                    } border`}
                  >
                    <h3 className="font-bold mb-2">Bulk Upload Summary:</h3>
                    <p className="text-sm">
                      <CheckCircle className="inline-block w-4 h-4 mr-1 text-green-400" />
                      Successfully created: {bulkUploadResult.success}
                    </p>
                    {bulkUploadResult.failed > 0 && (
                      <>
                        <p className="text-sm text-red-400">
                          <XCircle className="inline-block w-4 h-4 mr-1 text-red-400" />
                          Failed to create: {bulkUploadResult.failed}
                        </p>
                        {bulkUploadResult.errors.length > 0 && (
                          <div className="mt-2 text-xs text-red-300 max-h-24 overflow-y-auto border-t border-red-600 pt-2">
                            <p className="font-semibold">Errors:</p>
                            <ul className="list-disc list-inside">
                              {bulkUploadResult.errors.map((err, index) => (
                                <li key={index}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Certificate Preview */}
            <div className="card lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Certificate Preview</h2>

              {certificate ? (
                <div className="fade-in">
                  <CertificatePreview certificate={certificate} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-700 rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400">Certificate preview will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
