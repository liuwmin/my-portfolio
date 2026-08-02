import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import site from "@/content/site.json";

export const metadata: Metadata = {
  title: `${site.profile.name} · ${site.profile.tagline}`,
  description: site.profile.bio,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="dark overflow-x-hidden" suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden bg-black text-neutral-100 antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
