"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import site from "@/content/site.json";
import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/photography", label: "PHOTOGRAPHY" },
  { href: "/ai-works", label: "AI" },
  { href: "/videos", label: "VIDEOS" },
  { href: "/blog", label: "BLOG" },
  { href: "/about", label: "ABOUT" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-black/80 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.3em] text-white"
        >
          {site.profile.name}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-xs uppercase tracking-[0.25em] transition-opacity duration-300",
                isActive(l.href)
                  ? "text-white opacity-100"
                  : "text-white/50 hover:text-white hover:opacity-100"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Menu"
        >
          <Menu size={22} />
        </button>
      </nav>

      <Sheet open={open} onClose={() => setOpen(false)}>
        <div className="mt-12 flex flex-col gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "text-base uppercase tracking-[0.25em]",
                isActive(l.href) ? "text-white" : "text-white/70"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </Sheet>
    </header>
  );
}
