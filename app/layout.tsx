import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Sales Systems for Small Businesses in Nigeria | 1010 Web Studio",
  description: "We help Nigerian small businesses sell online without stress. Simple product catalogs, clean websites, and automated sales systems that let customers browse and order easily—no more endless WhatsApp back-and-forth.",
  keywords: "small business Nigeria, online selling Nigeria, product catalog, sales system, business website Nigeria, WhatsApp business, online store Nigeria",
  authors: [{ name: "1010 Web Studio" }],
  openGraph: {
    title: "Sales Systems for Small Businesses in Nigeria | 1010 Web Studio",
    description: "We help Nigerian small businesses sell online without stress. Simple product catalogs and sales systems that work.",
    url: "https://1010web.studio",
    siteName: "1010 Web Studio",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "https://1010web.studio/Primary Logo.svg",
        width: 1200,
        height: 630,
        alt: "1010 Web Studio - Sales Systems for Nigerian Small Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sales Systems for Small Businesses in Nigeria | 1010 Web Studio",
    description: "We help Nigerian small businesses sell online without stress. Simple product catalogs and sales systems that work.",
    images: ["https://1010web.studio/Primary Logo.svg"],
  },
  icons: {
    icon: '/Primary Logo.svg',
    shortcut: '/Primary Logo.svg',
    apple: '/Primary Logo.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NG">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "1010 Web Studio",
              "url": "https://1010web.studio",
              "logo": "https://1010web.studio/1010%20Primary%20Logo.svg",
              "description": "Sales systems and websites for small businesses in Nigeria. We help businesses sell online without stress using clean product catalogs and automated sales systems.",
              "areaServed": {
                "@type": "Country",
                "name": "Nigeria"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "NG"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+234-904-099-1849",
                "contactType": "Customer Service",
                "areaServed": "NG",
                "availableLanguage": ["English"]
              },
              "sameAs": [
                "https://wa.me/2349040991849"
              ],
              "slogan": "Display everything you sell, in one link",
              "foundingDate": "2024",
              "serviceArea": {
                "@type": "Country",
                "name": "Nigeria"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
