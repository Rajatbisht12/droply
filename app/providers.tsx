"use client";

import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ImageKitProvider } from "imagekitio-next";
import { ToastProvider } from "@heroui/toast";
import { createContext, useContext, useEffect } from "react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

// Create a context for ImageKit authentication
export const ImageKitAuthContext = createContext<{
  authenticate: () => Promise<{
    signature: string;
    token: string;
    expire: number;
  }>;
}>({
  authenticate: async () => ({ signature: "", token: "", expire: 0 }),
});

export const useImageKitAuth = () => useContext(ImageKitAuthContext);

// ImageKit authentication function
const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit-auth");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  
  // Add useEffect to handle initial client-side theme application
  // This helps avoid hydration mismatches
  useEffect(() => {
    // This code only runs on the client after hydration is complete
    const root = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Remove any server-side generated themes to prevent mismatches
    if (root.hasAttribute('data-theme')) {
      root.removeAttribute('data-theme');
    }
    if (root.style.colorScheme) {
      root.style.colorScheme = '';
    }
  }, []);

  return (
    <HeroUIProvider navigate={router.push}>
      <ImageKitProvider
        authenticator={authenticator}
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""}
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
      >
        <ImageKitAuthContext.Provider value={{ authenticate: authenticator }}>
          <ToastProvider placement="top-right" />
          <NextThemesProvider 
            attribute="data-theme" 
            defaultTheme="dark"
            enableSystem={true}
            disableTransitionOnChange
            {...themeProps}
          >
            {children}
          </NextThemesProvider>
        </ImageKitAuthContext.Provider>
      </ImageKitProvider>
    </HeroUIProvider>
  );
}