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
  title: 'DopaCart® | Digital Luxury Vault',
  description: 'Pure Digital Impulse. Zero Real Cash.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DopaCart',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#C8A24F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
