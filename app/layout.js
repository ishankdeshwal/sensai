import {Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const inter=Inter({subsets:["latin"]})
export const metadata = {
  title: "CarrerGenie",
  description: "AI-powered career development platform. Build better resumes, craft compelling cover letters, and ace your interviews with personalized insights.",
  keywords: ["AI", "career", "resume", "cover letter", "interview", "professional development"],
  authors: [{ name: "Sensai Team" }],
  creator: "Sensai",
  publisher: "Sensai",
  robots: "index, follow",
  openGraph: {
    title: "Sensai - AI-Powered Career Development",
    description: "Empowering professionals with AI-driven career tools to accelerate their success.",
    url: "https://sensai.com",
    siteName: "Sensai",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sensai - AI-Powered Career Development",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sensai - AI-Powered Career Development",
    description: "Empowering professionals with AI-driven career tools to accelerate their success.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#6366f1" },
    ],
  },
  manifest: "/site.webmanifest",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#6366f1",
  colorScheme: "dark light",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme:dark
    }}>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} `}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* header */}
            <Header />
            <main className="min-h-screen">
              
            {children}
            </main>
            <Toaster richColors />
            <Footer />
          </ThemeProvider>
      </body>
    </html>
  </ClerkProvider>
  );
}
