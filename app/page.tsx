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
    <div className="min-h-screen overflow-x-hidden pt-16 sm:pt-20">
      <Header />

      {/* Hero Section - Animated and Branded */}
      <section className="relative container mx-auto px-2 sm:px-4 py-10 sm:py-20 text-center">
        {/* Floating FTLD Logo with Glow */}
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative inline-block mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-[#00FF7F] rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
              <Image
                src="/ftld-logo.svg"
                alt="FTLD Logo"
                width={128}
                height={128}
                className="w-full h-full object-contain animate-pulse"
                style={{ filter: "drop-shadow(0 0 20px #00FF7F40)" }}
              />
            </div>
          </div>

          {/* Hero Headlines */}
          <div className="max-w-5xl mx-auto mb-8 sm:mb-12">
            <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-8xl font-ultra font-bold mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#00FF7F] via-white to-[#0014A8] bg-clip-text text-transparent">
                For The Love
              </span>
              <br />
              <span className="text-white">Of DeFi</span>
            </h1>
            <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl text-gray-300 mb-2 sm:mb-4 leading-relaxed font-gill-sans">
              Empowering blockchain education through
            </p>
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-[#00FF7F] font-semibold font-gill-sans">
              verified achievements & community recognition
            </p>
          </div>

          {/* Dynamic CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-16">
            <Link
              href="/admin"
              className="group bg-[#00FF7F] text-black font-bold text-lg sm:text-xl px-6 sm:px-10 py-4 sm:py-5 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#00FF7F]/50 flex items-center gap-2 sm:gap-3"
            >
              <Award className="w-6 h-6" />
              Generate Certificate
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/verify"
              className="group bg-transparent border-2 border-[#0014A8] text-white font-bold text-lg sm:text-xl px-6 sm:px-10 py-4 sm:py-5 rounded-full hover:bg-[#0014A8] transition-all duration-300 transform hover:scale-105 flex items-center gap-2 sm:gap-3"
            >
              <Shield className="w-6 h-6" />
              Verify Now
            </Link>
          </div>

          {/* Live Stats */}
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-gray-900/50 backdrop-blur-sm border border-[#00FF7F]/30 rounded-full px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-base">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#00FF7F] rounded-full animate-pulse"></div>
              <span className="text-gray-300">Live:</span>
            </div>
            <span className="text-lg sm:text-2xl font-bold text-[#00FF7F]">
              {mounted ? certificateCount : 127}+
            </span>
            <span className="text-white">certificates issued</span>
          </div>
        </div>
      </section>

      {/* Visual Journey Section */}
      <section className="container mx-auto px-2 sm:px-4 py-10 sm:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-ultra font-bold mb-4 sm:mb-6">
            <span className="text-white">Your Journey to</span>
            <br />
            <span className="bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent">
              Blockchain Mastery
            </span>
          </h2>
          <p className="text-base xs:text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto font-gill-sans">
            From learning to certification, we're with you every step of the way
          </p>
        </div>

        {/* Journey Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-[#00FF7F] via-[#0014A8] to-[#00FF7F] opacity-30"></div>

            {[
              {
                icon: BookOpen,
                title: "Learn",
                desc: "Master blockchain & DeFi concepts",
                color: "#00FF7F",
              },
              {
                icon: CheckCircle,
                title: "Complete",
                desc: "Finish your chosen program",
                color: "#0014A8",
              },
              {
                icon: Award,
                title: "Certify",
                desc: "Receive your verified certificate",
                color: "#00FF7F",
              },
              {
                icon: Share2,
                title: "Share",
                desc: "Showcase your achievement",
                color: "#0014A8",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center group">
                  <div
                    className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center relative transition-all duration-500 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}20, ${step.color}10)`,
                      border: `2px solid ${step.color}40`,
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black/20"></div>
                    <step.icon
                      className="w-8 h-8 sm:w-12 sm:h-12 relative z-10"
                      style={{ color: step.color }}
                    />
                  </div>
                  <h3
                    className="text-lg sm:text-2xl font-ultra font-bold mb-2 sm:mb-3"
                    style={{ color: step.color }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-gill-sans text-sm sm:text-base">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof & Community */}
      <section className="container mx-auto px-2 sm:px-4 py-10 sm:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-ultra font-bold mb-4 sm:mb-6 text-white">
            Trusted by the{" "}
            <span className="text-[#00FF7F]">FTLD Community</span>
          </h2>
          <p className="text-base xs:text-lg sm:text-xl text-gray-400 font-gill-sans">
            Join hundreds of blockchain enthusiasts who've earned their
            credentials
          </p>
        </div>

        {/* Certificate Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto mb-8 sm:mb-16">
          {[
            {
              name: "Alex C.",
              program: "Smart Contract Training",
              date: "Dec 2024",
            },
            {
              name: "Sarah M.",
              program: "Smart Contract Training",
              date: "Jan 2025",
            },
            {
              name: "Jordan K.",
              program: "Smart Contract Training",
              date: "Jan 2025",
            },
          ].map((cert, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-[#00FF7F]/20 rounded-2xl p-4 sm:p-6 transform transition-all duration-300 group-hover:scale-105 group-hover:border-[#00FF7F]/50">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00FF7F]/20 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#00FF7F]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white font-gill-sans text-base sm:text-lg">
                      {cert.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-gill-sans">
                      {cert.date}
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 mb-2 sm:mb-4 font-gill-sans text-sm sm:text-base">
                  {cert.program}
                </p>
                <div className="flex items-center gap-2 text-[#00FF7F] text-xs sm:text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Verified Certificate
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partnership Badge */}
        <div className="text-center">
          <div className="inline-flex flex-wrap items-center gap-2 sm:gap-4 bg-[#0014A8]/20 border border-[#0014A8]/40 rounded-full px-4 sm:px-8 py-2 sm:py-4 text-xs sm:text-base">
            <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-[#0014A8]" />
            <span className="font-bold text-white font-gill-sans">
              Powered by Lisk Partnership
            </span>
            <div className="w-2 h-2 bg-[#0014A8] rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="container mx-auto px-2 sm:px-4 py-10 sm:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-ultra font-bold mb-4 sm:mb-6 text-white">
            Why Choose <span className="text-[#00FF7F]">FTLD CertForge</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {[
            {
              icon: Award,
              title: "Blockchain Verified",
              desc: "Every certificate is secured on the blockchain for ultimate authenticity",
              color: "#00FF7F",
            },
            {
              icon: Shield,
              title: "Instant Verification",
              desc: "QR codes and unique IDs for immediate authenticity checks",
              color: "#0014A8",
            },
            {
              icon: Users,
              title: "Social Sharing",
              desc: "Share your achievements on LinkedIn, Twitter, and beyond",
              color: "#00FF7F",
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              desc: "Generate and verify certificates in seconds, not minutes",
              color: "#0014A8",
            },
          ].map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 sm:p-8 text-center transition-all duration-300 group-hover:border-[#00FF7F]/50 group-hover:transform group-hover:scale-105">
                <div
                  className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon
                    className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 group-hover:scale-110"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="text-lg sm:text-2xl font-ultra font-bold mb-2 sm:mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed font-gill-sans text-sm sm:text-base">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-2 sm:px-4 py-10 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-ultra font-bold mb-4 sm:mb-6">
            <span className="text-white">Ready to</span>
            <br />
            <span className="bg-gradient-to-r from-[#00FF7F] to-[#0014A8] bg-clip-text text-transparent">
              Get Certified?
            </span>
          </h2>
          <p className="text-base xs:text-lg sm:text-xl text-gray-400 mb-4 sm:mb-8 font-gill-sans">
            Join the FTLD community and showcase your blockchain expertise to
            the world
          </p>
          <a
            href="https://t.me/FTLDOfficial"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#00FF7F] to-[#0014A8] text-white font-bold text-lg sm:text-xl px-6 sm:px-12 py-4 sm:py-6 rounded-full hover:from-[#0014A8] hover:to-[#00FF7F] transition-all duration-500 transform hover:scale-105 shadow-2xl"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        </div>
      </section>
    </div>
  );
}
