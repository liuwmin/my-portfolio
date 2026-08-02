"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import photos from "@/content/photos.json";
import aiWorks from "@/content/ai-works.json";
import videos from "@/content/videos.json";
import { MasonryGrid } from "@/components/masonry-grid";
import { AIGrid } from "@/components/ai-grid";
import { VideoCard } from "@/components/video-card";
import { cn } from "@/lib/utils";

const TABS = ["ALL", "PHOTO", "AI", "VIDEO"] as const;
type Tab = (typeof TABS)[number];

export function SelectedWorks() {
  const [tab, setTab] = useState<Tab>("ALL");

  const mixed = [
    ...photos.photos
      .slice(0, 2)
      .map((p) => ({ ...p, kind: "PHOTO" as const, href: "/photography" })),
    ...aiWorks.works
      .slice(0, 2)
      .map((p) => ({ ...p, kind: "AI" as const, href: "/ai-works" })),
    ...videos.videos
      .slice(0, 2)
      .map((p) => ({
        id: p.id,
        title: p.title,
        src: p.thumbnail,
        kind: "VIDEO" as const,
        href: "/videos",
      })),
  ];

  const viewAllHref =
    tab === "AI" ? "/ai-works" : tab === "VIDEO" ? "/videos" : "/photography";

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold uppercase tracking-[0.25em] text-neutral-100 md:text-4xl">
          Selected Works
        </h2>
        <div className="section-rule mt-4" />
      </div>

      <div className="mb-10 flex gap-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "text-xs uppercase tracking-[0.25em] transition-opacity",
              tab === t
                ? "text-white opacity-100"
                : "text-white/40 hover:text-white"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "ALL" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mixed.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={m.href}
                className="group relative block overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]"
              >
                <Image
                  src={m.src}
                  alt={m.title}
                  width={800}
                  height={600}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded bg-black/70 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white">
                  {m.kind}
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium tracking-wide text-white">
                    {m.title}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "PHOTO" && <MasonryGrid data={photos.photos.slice(0, 6)} />}
      {tab === "AI" && <AIGrid data={aiWorks.works.slice(0, 6)} />}
      {tab === "VIDEO" && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {videos.videos.slice(0, 6).map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Link
          href={viewAllHref}
          className="inline-flex items-center justify-center rounded-sm border border-white/15 bg-white/[0.03] px-6 py-3 text-xs uppercase tracking-[0.25em] text-neutral-100 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/[0.08]"
        >
          View All Works
        </Link>
      </div>
    </section>
  );
}
