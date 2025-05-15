// File: app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Droply",
  description: "Secure cloud storage for your images, powered by ImageKit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Important: Remove any theme-related attributes from the html tag
    <html lang="en" className={inter.variable}>
      <body 
        // Remove all theme-related classes from server-rendered components
        // Use only base styling classes that don't depend on theme
        className="antialiased"
      >
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}