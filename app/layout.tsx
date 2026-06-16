import type { Metadata } from "next";
import { Inter } from "next/font/google";
<<<<<<< Updated upstream
=======
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
>>>>>>> Stashed changes
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Corleone Guesthouse",
    template: "%s | Corleone Guesthouse",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-surface text-on-surface overflow-x-hidden">
        {children}
<<<<<<< Updated upstream
=======
        <Analytics />
        <SpeedInsights />
>>>>>>> Stashed changes
      </body>
    </html>
  );
}
