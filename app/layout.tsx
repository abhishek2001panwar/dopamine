import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BadgeUnlockToast } from "./components/BadgeUnlockToast";
import { LiveActivityTicker } from "./components/LiveActivityTicker";
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';


const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta'
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
});
export const metadata: Metadata = {
  title: "DopaCart — Luxury Vault",
  description:
    "Zero-Cost Digital Luxury Simulator & High-Fashion Vault",

  applicationName: "DopaCart",

  icons: {
    icon: [
      {
        url: "/next.svg",
        sizes: "192x192",
        type: "image/svg",
      },
      {
        url: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  appleWebApp: {
    capable: true,
    title: "DopaCart",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1C1712",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
         <BadgeUnlockToast />
         <LiveActivityTicker />{children}</body>
      {/* <body className="bg-black text-white">
       
        {children}
      </body> */}
    </html>
  );
}
