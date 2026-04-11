import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Person Search App",
  description: "A simple search app to find people by name",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
    <body
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased flex flex-col min-h-screen`}
    >          

<ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >

        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Toaster />

        <Footer />
        </ThemeProvider>

    </body>

  </html>  );
}

