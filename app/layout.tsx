import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import site from "@/content/site.json";

export const metadata: Metadata = {
  title: `${site.profile.name} · ${site.profile.tagline}`,
  description: site.profile.bio,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-neutral-100 antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
