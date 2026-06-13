import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/shared/auth";
import Navbar from "@/shared/components/layout/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Araya",
  description: "ERP Family Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f2f2f7] dark:bg-black text-[#1c1c1e] dark:text-[#f2f2f7]">
        <AuthProvider>
          <Navbar />
          <div className="flex-1 w-full">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
