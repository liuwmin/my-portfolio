"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type AIWork = {
  id: string;
  title: string;
  src: string;
  prompt: string;
  model: string;
  date?: string;
  category?: string;
};

const CATEGORIES = ["写真", "创意", "人设", "二次元"] as const;
type Category = (typeof CATEGORIES)[number] | "ALL";

function workCategory(w: AIWork): string {
  return w.category || "创意";
}

export function AIGrid({
  data,
  showTabs = true,
}: {
  data: AIWork[];
  showTabs?: boolean;
}) {
  const [active, setActive] = useState<AIWork | null>(null);
  const [cat, setCat] = useState<Category>("ALL");

  const filtered =
    cat === "ALL" ? data : data.filter((w) => workCategory(w) === cat);

  return (
    <>
      {showTabs && (
        <div className="mb-8 flex flex-wrap gap-x-8 gap-y-3 border-b border-white/10 pb-4">
          {(["ALL", ...CATEGORIES] as Category[]).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "text-sm uppercase tracking-[0.25em] transition-opacity",
                cat === c
                  ? "text-white opacity-100"
                  : "text-white/40 hover:text-white"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded border border-dashed border-white/10 py-12 text-center text-sm text-neutral-500">
          这个分类还没有作品，往对应文件夹里放图吧
        </p>
      ) : (
        <div className="columns-1 gap-4 md:columns-2 lg:columns-3 [&>*]:mb-4">
          {filtered.map((w, i) => (
            <motion.button
              key={w.id}
              onClick={() => setActive(w)}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.src}
                alt={w.title}
                loading="lazy"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded bg-black/60 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white backdrop-blur">
                {workCategory(w)}
              </span>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/85 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
                <p className="text-base font-medium tracking-wide text-white">
                  {w.title}
                </p>
                <p className="mt-2 line-clamp-3 text-xs text-neutral-300">
                  {w.prompt}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-neutral-400">
                  {w.model}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <Dialog open={!!active} onClose={() => setActive(null)}>
        {active && (
          <div className="bg-neutral-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt={active.title}
              className="mx-auto block max-h-[70vh] w-auto max-w-full h-auto"
            />
            <div className="p-6">
              <div className="flex items-center gap-3">
                <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-neutral-300">
                  {workCategory(active)}
                </span>
                <p className="text-lg font-medium tracking-wide text-white">
                  {active.title}
                </p>
              </div>
              <p className="mt-2 text-sm text-neutral-300">{active.prompt}</p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-neutral-400">
                {active.model}
                {active.date ? ` · ${active.date}` : ""}
              </p>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}