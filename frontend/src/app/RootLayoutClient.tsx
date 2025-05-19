"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar =
    pathname === "/" ||
    pathname?.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register";


  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className={`${inter.className} min-h-screen bg-gray-100 dark:bg-gray-950`}>
        {!hideNavbar && <Navbar />}
        <main>{children}</main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
