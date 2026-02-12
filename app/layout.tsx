import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
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
  metadataBase: new URL('https://1010web.studio'),
  alternates: {
    canonical: '/',
  },
  title: "Stop Losing Sales on WhatsApp | Fashion Brands in Nigeria",
  description: "Nigerian fashion brands lose customers on WhatsApp every day. We build you one simple link so people can see your clothes and buy easily. No more typing prices 20 times.",
  keywords: "sell clothes on WhatsApp Nigeria, WhatsApp business for fashion brands, fashion store WhatsApp Nigeria, online store link for Nigerian fashion, how to organize WhatsApp fashion business, sell fashion on WhatsApp, Nigerian fashion business, WhatsApp store for clothes, fashion brand Nigeria, stop losing sales WhatsApp",
  authors: [{ name: "1010 Web Studio" }],
  openGraph: {
    title: "Stop Losing Sales on WhatsApp | Nigerian Fashion Brands",
    description: "Tired of typing prices and sizes 20 times a day? We build fashion brands one simple link. Customers see your clothes and buy. No stress.",
    url: "https://1010web.studio",
    siteName: "1010 Web Studio",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "https://1010web.studio/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "1010 Web Studio - WhatsApp Store for Nigerian Fashion Brands",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stop Losing Sales on WhatsApp | Fashion Brands in Nigeria",
    description: "Tired of typing prices 20 times a day? We build you one simple link. Customers see your clothes and buy. No stress.",
    images: ["https://1010web.studio/android-chrome-512x512.png"],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "1010 Web Studio",
              "url": "https://1010web.studio",
              "logo": "https://1010web.studio/android-chrome-512x512.png",
              "description": "We help Nigerian fashion brands stop losing sales on WhatsApp. One simple link where customers see your clothes and buy easily. No more typing prices 20 times a day.",
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
              "slogan": "Stop Losing Sales on WhatsApp",
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
        <GoogleAnalytics gaId="G-8C29XR6MV9" />
      </body>
    </html>
  );
}
