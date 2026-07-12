import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { roRO } from '@clerk/localizations'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { AccessibilityProvider } from '@/lib/a11y/AccessabilityContext'
import ContrastFAB from '@/components/ContrastToggle'

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Click && Build",
  description: "Construiește-ți site-ul în câteva secunde cu AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}>
        <ClerkProvider localization={roRO}>
          <LanguageProvider>
            <AccessibilityProvider>
              <div id="app-shell" className="min-h-full flex flex-col flex-1">
                {children}
              </div>
              <ContrastFAB />
            </AccessibilityProvider>
          </LanguageProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}