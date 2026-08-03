"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog } from "@/components/ui/dialog";

export type Photo = {
  id: string;
  title: string;
  src: string;
  aspectRatio?: string; // 已弃用：图片按原始比例展示
  location?: string;
};

export function MasonryGrid({ data }: { data: Photo[] }) {
  const [active, setActive] = useState<Photo | null>(null);

  return (
    <>
      <div className="columns-1 gap-4 md:columns-2 lg:columns-3 [&>*]:mb-4">
        {data.map((p, i) => (
          <motion.button
            key={p.id}
            onClick={() => setActive(p)}
            className="group relative block w-full break-inside-avoid overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.src}
              alt={p.title}
              loading="lazy"
              className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
              <p className="text-sm font-medium tracking-wide text-white">
                {p.title}
              </p>
              {p.location && (
                <p className="text-xs text-neutral-400">{p.location}</p>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <Dialog open={!!active} onClose={() => setActive(null)} className="w-fit max-w-[95vw] bg-transparent border-0">
        {active && (
          <div className="bg-neutral-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt={active.title}
              className="mx-auto block max-h-[78vh] w-auto max-w-full h-auto"
            />
            <div className="p-6">
              <p className="text-lg font-medium tracking-wide text-white">
                {active.title}
              </p>
              {active.location && (
                <p className="mt-1 text-sm text-neutral-400">{active.location}</p>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}