import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

const Providers = dynamic(() => import("@/components/Providers"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "FTLD CertForge - Certificate Generation & Verification",
  description: "Generate and verify certificates for FTLD programs",
  generator: "v0.dev",
  icons: {
    icon: "/ftld-logo.svg",
    shortcut: "/ftld-logo.svg",
    apple: "/ftld-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
