import type { Metadata } from "next";
import { Aref_Ruqaa, IBM_Plex_Mono } from "next/font/google";

import { ClerkProvider } from "@/components/clerk-provider";
import { Signature } from "@/components/signature";

import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`dark ${plexMono.variable} ${arefRuqaa.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>{children}</ClerkProvider>
        <Signature />
      </body>
    </html>
  );
}
