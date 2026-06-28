import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BrollScan — AI-Powered B-Roll Finder",
    template: "%s | BrollScan",
  },
  description:
    "Analyze your video script and find perfect stock footage for every scene. Powered by AI with footage from Pexels and Pixabay.",
  keywords: [
    "b-roll",
    "stock footage",
    "video editing",
    "script analysis",
    "AI",
    "pexels",
    "pixabay",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased bg-dark text-foreground min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
