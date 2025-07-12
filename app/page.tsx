"use client";

import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Shield,
  Award,
  Users,
  Zap,
  ArrowRight,
  BookOpen,
  Share2,
  CheckCircle,
  Star,
  Globe,
  Sparkles,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function HomePage() {
  const [certificateCount, setCertificateCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsVisible(true);
    // Animate certificate counter
    const timer = setInterval(() => {
      setCertificateCount((prev) => {
        if (prev < 127) return prev + 1;
        clearInterval(timer);
        return 127;
      });
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300FF7F' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-ultra font-bold mb-8">
              <span className="text-white">FTLD</span>
              <br />
              <span className="bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent">
                CertForge
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 font-gill-sans">
              For The Love Of Defi - Blockchain Certification Platform
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/admin"
                className="group bg-[#00FF7F] text-black font-bold text-xl px-10 py-5 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#00FF7F]/50 flex items-center gap-3"
              >
                <Award className="w-6 h-6" />
                Generate Certificate
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/verify"
                className="group bg-transparent border-2 border-[#0014A8] text-white font-bold text-xl px-10 py-5 rounded-full hover:bg-[#0014A8] transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
              >
                <Shield className="w-6 h-6" />
                Verify Now
              </Link>
            </div>

            {/* Live Stats */}
            <div className="inline-flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm border border-[#00FF7F]/30 rounded-full px-8 py-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#00FF7F] rounded-full animate-pulse"></div>
                <span className="text-gray-300">Live:</span>
              </div>
              <span className="text-2xl font-bold text-[#00FF7F]">
                {mounted ? certificateCount : 127}+
              </span>
              <span className="text-white">certificates issued</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Journey Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-ultra font-bold mb-6">
              <span className="text-white">Your Journey to</span>
              <br />
              <span className="bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent">
                Blockchain Mastery
              </span>
            </h2>
            <p className="text-xl text-gray-400 font-gill-sans">
              From learning to certification, we guide you every step of the way
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00FF7F] to-[#00CC66] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-ultra font-bold text-white mb-4">
                Learn
              </h3>
              <p className="text-gray-400 font-gill-sans">
                Master blockchain fundamentals and advanced concepts through our
                comprehensive curriculum
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0014A8] to-[#000080] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-ultra font-bold text-white mb-4">
                Certify
              </h3>
              <p className="text-gray-400 font-gill-sans">
                Earn verifiable certificates that showcase your expertise to the
                blockchain community
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00FF7F] to-[#0014A8] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-ultra font-bold text-white mb-4">
                Connect
              </h3>
              <p className="text-gray-400 font-gill-sans">
                Join the global FTLD community and connect with fellow
                blockchain enthusiasts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-ultra font-bold mb-6">
              <span className="text-white">Why Choose</span>
              <br />
              <span className="bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent">
                FTLD CertForge?
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#00FF7F] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-ultra font-bold text-white mb-3">
                Secure
              </h3>
              <p className="text-gray-400 text-sm font-gill-sans">
                Blockchain-verified certificates that can't be forged or
                tampered with
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#0014A8] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-ultra font-bold text-white mb-3">
                Instant
              </h3>
              <p className="text-gray-400 text-sm font-gill-sans">
                Get your certificates instantly with real-time verification
                capabilities
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#00FF7F] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-ultra font-bold text-white mb-3">
                Community
              </h3>
              <p className="text-gray-400 text-sm font-gill-sans">
                Join a thriving community of blockchain professionals and
                enthusiasts
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#0014A8] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-ultra font-bold text-white mb-3">
                Innovative
              </h3>
              <p className="text-gray-400 text-sm font-gill-sans">
                Cutting-edge technology with smart contracts and decentralized
                verification
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-ultra font-bold mb-6">
            <span className="text-white">Ready to</span>
            <br />
            <span className="bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent">
              Get Certified?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 font-gill-sans">
            Join the FTLD community and showcase your blockchain expertise to
            the world
          </p>
          <a
            href="https://t.me/FTLDOfficial"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00FF7F] to-[#0014A8] text-white font-bold text-xl px-12 py-6 rounded-full hover:from-[#0014A8] hover:to-[#00FF7F] transition-all duration-500 transform hover:scale-105 shadow-2xl"
          >
            Start Your Journey
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </section>
    </div>
  );
}
