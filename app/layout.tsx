import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BotIdProvider from "./components/BotIdProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Corleone Guesthouse",
    template: "%s | Corleone Guesthouse",
  },
  description:
    "L'essenza del minimalismo architettonico nel cuore della città. Un rifugio esclusivo dove ogni dettaglio è sottratto fino alla perfezione.",
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
        <Header />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
        <BotIdProvider />
      </body>
    </html>
  );
}
