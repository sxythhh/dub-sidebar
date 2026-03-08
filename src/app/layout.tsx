import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SideNavProvider } from "@/components/sidebar/sidebar-context";
import { MainNav } from "@/components/sidebar/main-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Dub Sidebar Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} ${inter.variable} bg-neutral-200 antialiased`}>
        <SideNavProvider>
          <MainNav>{children}</MainNav>
        </SideNavProvider>
      </body>
    </html>
  );
}
