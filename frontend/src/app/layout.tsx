import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { InitialLoader } from "@/components/layout/InitialLoader";
import { AuroraBackground } from "@/components/layout/AuroraBackground";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DMX — DataMatrix | RGIT Mumbai's AI & ML Community",
    template: "%s | DMX",
  },
  description:
    "DMX (DataMatrix) is the official AI & Machine Learning student committee of MCT's Rajiv Gandhi Institute of Technology, Mumbai. We run hackathons, workshops, research projects, and speaker sessions.",
  keywords: [
    "DMX",
    "DataMatrix",
    "RGIT",
    "AI",
    "Machine Learning",
    "Hack2Infinity",
    "Mumbai",
    "student committee",
  ],
  authors: [{ name: "DMX — DataMatrix, RGIT Mumbai" }],
  openGraph: {
    title: "DMX — DataMatrix | RGIT Mumbai's AI & ML Community",
    description:
      "Student-run AI & Machine Learning research community at RGIT Mumbai.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <AuroraBackground />
          <InitialLoader />
          <Navbar />
          <CommandPalette />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
