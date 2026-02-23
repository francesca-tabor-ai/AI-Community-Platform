import type { Metadata } from "next";
import { Source_Sans_3, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "./components/MainLayout";
import Providers from "./providers";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Community Platform | Build Intelligent Communities",
  description:
    "Build, grow, and monetize communities with the first AI-native platform. AI-powered management, engagement, and personalized experiences at scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
        <MainLayout>{children}</MainLayout>
      </Providers>
      </body>
    </html>
  );
}
