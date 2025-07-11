import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut, Wallet, ChevronDown } from "lucide-react";
import { useUserContext } from "../contexts/UserContext";
import AuthModal from "./AuthModal";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, walletAddress, signOut } = useUserContext();

  const handleAuthSuccess = (user: any) => {
    setAuthModalOpen(false);
    // User is now logged in, context will update automatically
  };

  return (
    <>
      <header className="bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                <div className="w-full h-full bg-[#00FF7F] rounded-full flex items-center justify-center">
                  <span className="text-black font-ultra font-bold text-sm sm:text-base">
                    FTLD
                  </span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-ultra font-bold text-white">
                  CertForge
                </h1>
                <p className="text-xs text-gray-400">For The Love Of Defi</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/admin"
                className="text-gray-300 hover:text-[#00FF7F] transition-colors font-medium"
              >
                Admin
              </Link>
              <Link
                href="/students"
                className="text-gray-300 hover:text-[#00FF7F] transition-colors font-medium"
              >
                Students
              </Link>
              <Link
                href="/verify"
                className="text-gray-300 hover:text-[#00FF7F] transition-colors font-medium"
              >
                Verify
              </Link>
            </nav>

            {/* Desktop Auth/User Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#00FF7F] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-white text-sm font-medium">
                      {user.email?.split("@")[0] || "User"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#101010] border border-gray-800 rounded-xl shadow-xl">
                      <div className="p-4 border-b border-gray-800">
                        <p className="text-white font-medium">{user.email}</p>
                        {walletAddress && (
                          <div className="mt-2 flex items-center space-x-2">
                            <Wallet className="w-4 h-4 text-[#00FF7F]" />
                            <span className="text-gray-400 text-xs font-mono">
                              {walletAddress.slice(0, 6)}...
                              {walletAddress.slice(-4)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <button
                          onClick={signOut}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-[#00FF7F] hover:bg-[#00CC66] text-black font-bold px-6 py-2 rounded-xl transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white p-2"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div
                  className={`w-6 h-1 bg-white transition-all ${
                    menuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <div
                  className={`w-6 h-1 bg-white transition-all ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <div
                  className={`w-6 h-1 bg-white transition-all ${
                    menuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
              <nav className="flex flex-col space-y-2 mt-4">
                <Link
                  href="/admin"
                  className="text-gray-300 hover:text-[#00FF7F] transition-colors font-medium py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
                <Link
                  href="/students"
                  className="text-gray-300 hover:text-[#00FF7F] transition-colors font-medium py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Students
                </Link>
                <Link
                  href="/verify"
                  className="text-gray-300 hover:text-[#00FF7F] transition-colors font-medium py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Verify
                </Link>
              </nav>

              {/* Mobile Auth Section */}
              <div className="mt-4 pt-4 border-t border-gray-800">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 bg-gray-900 px-3 py-2 rounded-lg">
                      <div className="w-6 h-6 bg-[#00FF7F] rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-black" />
                      </div>
                      <span className="text-white text-sm">
                        {user.email?.split("@")[0] || "User"}
                      </span>
                    </div>
                    {walletAddress && (
                      <div className="flex items-center space-x-2 text-gray-400 text-xs px-3">
                        <Wallet className="w-3 h-3 text-[#00FF7F]" />
                        <span className="font-mono">
                          {walletAddress.slice(0, 6)}...
                          {walletAddress.slice(-4)}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full bg-[#00FF7F] hover:bg-[#00CC66] text-black font-bold px-4 py-2 rounded-xl transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
