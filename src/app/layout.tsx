import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://builder.co.uk';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Builder | Find Trusted Tradespeople Near You",
    template: "%s | Builder",
  },
  description: "Connect with verified builders, plumbers, electricians, and other tradespeople in your area. Read reviews, compare quotes, and hire with confidence.",
  keywords: ["tradespeople", "builders", "plumbers", "electricians", "UK", "verified", "reviews", "home improvement", "contractors", "local tradespeople"],
  authors: [{ name: "Builder" }],
  creator: "Builder",
  publisher: "Builder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Builder",
    title: "Builder | Find Trusted Tradespeople Near You",
    description: "Connect with verified builders, plumbers, electricians, and other tradespeople in your area. Read reviews, compare quotes, and hire with confidence.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Builder - Find Trusted Tradespeople",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Builder | Find Trusted Tradespeople Near You",
    description: "Connect with verified builders, plumbers, electricians, and other tradespeople in your area.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
