import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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
              <h1 className="text-2xl font-bold text-white">FTLD CertForge</h1>
              <p className="text-sm text-gray-400">For The Love Of Defi</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Admin
            </Link>
            <Link
              href="/students"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Students
            </Link>
            <Link
              href="/verify"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Verify
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-green-400">
              <svg
                className="w-6 h-6"
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
          </div>
        </div>
      </div>
    </header>
  );
}
