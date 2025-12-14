import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

// use Quicksand (close to your original design)
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Shiori-Sama - Streaming",
  description: "Shiori-Sama, anime / manga streaming with curated carousels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${quicksand.variable} antialiased`}>{children}</body>
    </html>
  );
}
