import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Nav } from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "brainyprep.ai Assessment - Next.js",
  description: "brainyprep.ai Full-Stack Blockchain Developer Assessment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Global Navigation */}
        <Nav />

        {/* Main App Content */}
        <main className="min-h-screen px-4 py-4">{children}</main>

        {/* Global Toaster (needed for toast notifications) */}
        <Toaster />
        
      </body>
    </html>
  );
}
