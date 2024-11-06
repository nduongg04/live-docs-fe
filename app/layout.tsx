import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import Provider from "./Provider";
import AuthProvider from "./AuthProvider";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "LiveDocs",
    description: "Your go-to collaborative editor",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen font-sans antialiased",
                    fontSans.variable,
                )}
            >
				<Toaster />
                <AuthProvider>
                    <Provider>{children}</Provider>
					
					
                </AuthProvider>
            </body>
        </html>
    );
}
