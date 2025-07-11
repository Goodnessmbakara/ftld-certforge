import Link from "next/link";
import Image from "next/image";
import { useUserContext } from "../contexts/UserContext";
import { useState } from "react";

export default function Header() {
  const { user, displayName, signOut } = useUserContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo and Nav */}
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 flex items-center justify-center">
              <Image
                src="/ftld-logo.svg"
                alt="FTLD Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-ultra font-bold text-white leading-tight">
                FTLD CertForge
              </h1>
              <p className="text-sm text-gray-400 font-gill-sans leading-tight">
                For The Love Of Defi
              </p>
            </div>
          </Link>
          <nav className="flex items-center space-x-6 ml-8">
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
        </div>
        {/* Right: User Profile/Sign In */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-[#00FF7F] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">
                    {(displayName || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white text-sm font-medium">
                  {displayName || "User"}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#101010] border border-gray-800 rounded-xl shadow-xl z-50">
                  <div className="p-4 border-b border-gray-800">
                    <p className="text-white font-medium">
                      {displayName || "User"}
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs text-gray-400">
                        Signed in with Supabase
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={signOut}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                        />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                // Open AuthModal (should be handled in parent/layout)
                if (typeof window !== "undefined") {
                  const event = new CustomEvent("open-auth-modal");
                  window.dispatchEvent(event);
                }
              }}
              className="bg-[#00FF7F] hover:bg-[#00CC66] text-black font-bold px-6 py-2 rounded-xl transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
