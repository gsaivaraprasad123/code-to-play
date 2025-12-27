import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeInitializer } from "@/components/ThemeInitializer";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Code To Play",
  description: "Transform your ideas into playable 2D games using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeInitializer /> {/* Force dark mode on mount */}
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
