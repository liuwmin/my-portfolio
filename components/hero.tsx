"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MetalAccent } from "@/components/ui/metal-accent";
import site from "@/content/site.json";

export function Hero() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <Image
        src={site.hero.backgroundImage}
        alt={site.hero.title}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <MetalAccent className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="shimmer text-6xl font-bold tracking-[0.2em] md:text-8xl"
        >
          {site.hero.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-6 text-sm uppercase tracking-[0.4em] text-neutral-300 md:text-base"
        >
          {site.hero.subtitle}
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-10 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={28} className="text-white/70" />
      </motion.div>
    </section>
  );
}
