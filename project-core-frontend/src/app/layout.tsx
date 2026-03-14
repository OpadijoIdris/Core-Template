import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  title: "TemplateStore | Luxury Watches & Jewelry",
  description: "Exquisite jewelry and timepieces crafted for your unique story.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`flex flex-col min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {/* Navbar at the top */}
          <Navbar />

          {/* Main content grows to push footer down */}
          <main className="flex-grow">{children}</main>

          {/* Footer at the bottom */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
