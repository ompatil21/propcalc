import type { Metadata } from "next";
import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";

export const metadata: Metadata = {
    title: "PropCalc | Property Investment Calculator",
    description: "Calculate and analyze your real estate investments",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <RootLayoutClient>{children}</RootLayoutClient>
            </body>
        </html>
    );
}
