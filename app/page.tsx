import Header from "@/components/Header"
import Link from "next/link"
import { Shield, Award, Users, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent">
            FTLD CertForge
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Generate and verify certificates for For The Love of DeFi programs with blockchain-powered authenticity
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/admin" className="btn-primary text-lg px-8 py-4">
              Admin Dashboard
            </Link>
            <Link href="/verify" className="btn-secondary text-lg px-8 py-4">
              Verify Certificate
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card text-center fade-in">
            <div className="w-16 h-16 bg-[#00FF7F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-[#00FF7F]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Generate Certificates</h3>
            <p className="text-gray-400">Create professional certificates for FTLD program completions</p>
          </div>

          <div className="card text-center fade-in">
            <div className="w-16 h-16 bg-[#0014A8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#0014A8]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Verify Authenticity</h3>
            <p className="text-gray-400">Instant verification with unique codes and QR scanning</p>
          </div>

          <div className="card text-center fade-in">
            <div className="w-16 h-16 bg-[#00FF7F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-[#00FF7F]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Share & Download</h3>
            <p className="text-gray-400">Easy sharing on social platforms and PDF downloads</p>
          </div>

          <div className="card text-center fade-in">
            <div className="w-16 h-16 bg-[#0014A8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[#0014A8]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lisk Partnership</h3>
            <p className="text-gray-400">Powered by Lisk blockchain technology for security</p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Available Programs</h2>
          <p className="text-xl text-gray-400">Currently supporting these FTLD educational programs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="card">
            <div className="w-full h-32 bg-gradient-to-br from-[#00FF7F] to-[#0014A8] rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">SC</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Contract Training</h3>
            <p className="text-gray-400 mb-4">Comprehensive blockchain development course sponsored by Lisk</p>
            <div className="flex items-center text-sm text-[#00FF7F]">
              <span className="w-2 h-2 bg-[#00FF7F] rounded-full mr-2"></span>
              Active Program
            </div>
          </div>

          <div className="card opacity-60">
            <div className="w-full h-32 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-400">FP1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Future Program 1</h3>
            <p className="text-gray-400 mb-4">Coming soon - Advanced DeFi protocols and strategies</p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
              Coming Soon
            </div>
          </div>

          <div className="card opacity-60">
            <div className="w-full h-32 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-400">FP2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Future Program 2</h3>
            <p className="text-gray-400 mb-4">Coming soon - NFT development and marketplace creation</p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
              Coming Soon
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
