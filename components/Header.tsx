import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <Image
                src="/ftld-logo.svg"
                alt="FTLD Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-ultra font-bold text-white leading-tight">
                FTLD CertForge
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-gill-sans">
                For The Love Of Defi
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-4 sm:space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-green-400 transition-colors font-gill-sans"
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="text-gray-300 hover:text-green-400 transition-colors font-gill-sans"
            >
              Admin
            </Link>
            <Link
              href="/students"
              className="text-gray-300 hover:text-green-400 transition-colors font-gill-sans"
            >
              Students
            </Link>
            <Link
              href="/verify"
              className="text-gray-300 hover:text-green-400 transition-colors font-gill-sans"
            >
              Verify
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-gray-300 hover:text-green-400 focus:outline-none"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open navigation menu"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {/* Mobile dropdown menu */}
            {menuOpen && (
              <div className="absolute right-2 top-16 bg-black bg-opacity-95 border border-gray-800 rounded-xl shadow-xl py-4 px-6 flex flex-col space-y-3 w-44 animate-fade-in">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-green-400 font-gill-sans"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/admin"
                  className="text-gray-300 hover:text-green-400 font-gill-sans"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
                <Link
                  href="/students"
                  className="text-gray-300 hover:text-green-400 font-gill-sans"
                  onClick={() => setMenuOpen(false)}
                >
                  Students
                </Link>
                <Link
                  href="/verify"
                  className="text-gray-300 hover:text-green-400 font-gill-sans"
                  onClick={() => setMenuOpen(false)}
                >
                  Verify
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
