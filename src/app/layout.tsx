import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/store/ReduxProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Garment Order Scheduler",
    description: "A mini order scheduling web app for the garment industry",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-full`}
            >
                <Toaster position="top-right" />
                <ReduxProvider>
                    <section className="flex flex-col-reverse md:flex-row h-screen font-work-sans relative w-full">
                        <div className="sticky h-fit md:h-full bottom-[0px] md:left-0 z-50">
                            <Navbar />
                        </div>
                        <div className="h-full w-full">{children}</div>
                    </section>
                </ReduxProvider>
            </body>
        </html>
    );
}
