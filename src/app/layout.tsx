import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SideNavProvider } from "@/components/sidebar/sidebar-context";
import { MainNav } from "@/components/sidebar/main-nav";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Outpace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} ${inter.variable} select-none overflow-x-hidden bg-page-outer-bg text-foreground antialiased`}>
        <ThemeProvider>
          <ToastProvider position="bottom-right">
            <SideNavProvider>
              <MainNav>{children}</MainNav>
            </SideNavProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
