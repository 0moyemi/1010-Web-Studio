import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FirstLoadAnimation from "./components/FirstLoadAnimation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "1010 Web Studio | Professional Web Development for Small Businesses",
  description: "Custom websites built to convert visitors into customers. We help small businesses build trust and grow online with professional web design, security, and SEO.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FirstLoadAnimation />
        <div id="page-content" style={{ opacity: 0 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
