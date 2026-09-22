import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UniversitySelector } from "@/components/layout/UniversitySelector";
import { UniversityProvider } from "@/app/lib/context/UniversityContext";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "USPA - Smart Programme Advisor",
  description:
    "Discover academic programmes, check your eligibility, get recommendations,and find the perfect programme for your qualifications.",
  keywords: [
    "programme advisor",
    "admission eligibility",
    "university programmes",
    "academic guidance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>
              <UniversityProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <UniversitySelector />
              </UniversityProvider>
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}