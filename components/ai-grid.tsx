"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Dialog } from "@/components/ui/dialog";

export type AIWork = {
  id: string;
  title: string;
  src: string;
  prompt: string;
  model: string;
  date?: string;
};

export function AIGrid({ data }: { data: AIWork[] }) {
  const [active, setActive] = useState<AIWork | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((w, i) => (
          <motion.button
            key={w.id}
            onClick={() => setActive(w)}
            className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
          >
            <Image
              src={w.src}
              alt={w.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-black/70 p-5 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
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

      <Dialog open={!!active} onClose={() => setActive(null)}>
        {active && (
          <div className="bg-neutral-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt={active.title}
              className="mx-auto block max-h-[70vh] w-auto"
            />
            <div className="p-6">
              <p className="text-lg font-medium tracking-wide text-white">
                {active.title}
              </p>
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
