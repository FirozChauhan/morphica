import type { Metadata } from "next";
import { Archivo_Black, Aref_Ruqaa, Inter } from "next/font/google";

import { ClerkProvider } from "@/components/clerk-provider";
import { Signature } from "@/components/signature";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false,
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const arefRuqaa = Aref_Ruqaa({
  variable: "--font-aref-ruqaa",
  subsets: ["arabic"],
  weight: "400",
  preload: false,
});

export const metadata: Metadata = {
  title: "Morphica",
  description:
    "Stateless, serverless image processing — one request, zero persistence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${archivoBlack.variable} ${arefRuqaa.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>{children}</ClerkProvider>
        <Signature />
      </body>
    </html>
  );
}
