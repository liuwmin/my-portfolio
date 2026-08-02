"use client";
import { useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import site from "@/content/site.json";

export default function AboutPage() {
  const { profile } = site;
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="overflow-hidden rounded-lg border border-white/15">
            <Image
              src={profile.avatar}
              alt={profile.name}
              width={400}
              height={400}
              className="h-auto w-full"
            />
          </div>
          <div className="mt-6 space-y-3">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
            >
              <Mail size={16} /> {profile.email}
            </a>
            <div className="flex gap-4 text-xs uppercase tracking-[0.25em]">
              <a
                href={profile.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                Instagram
              </a>
              <a
                href={profile.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                Twitter
              </a>
              <a
                href={profile.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                YouTube
              </a>
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-5xl font-semibold uppercase tracking-[0.25em] text-neutral-100 md:text-7xl">
            About
          </h1>
          <p className="mt-8 text-lg leading-8 text-neutral-300">
            {profile.bio}
          </p>

          <div className="mt-12 rounded-lg border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="text-sm uppercase tracking-[0.25em] text-neutral-200">
              Get in touch
            </h2>
            <p className="mt-3 text-sm text-neutral-400">
              想合作或聊聊？直接发邮件给我最方便：
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-4 inline-flex items-center justify-center rounded-sm border border-white/15 bg-white/[0.03] px-6 py-3 text-xs uppercase tracking-[0.25em] text-neutral-100 transition-all hover:border-white/40 hover:bg-white/[0.08]"
            >
              {profile.email}
            </a>

            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                setTimeout(() => setSent(false), 4000);
              }}
            >
              <input
                type="text"
                required
                placeholder="你的名字"
                className="w-full rounded-sm border border-white/15 bg-black/40 px-4 py-3 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-white/40"
              />
              <input
                type="email"
                required
                placeholder="你的邮箱"
                className="w-full rounded-sm border border-white/15 bg-black/40 px-4 py-3 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-white/40"
              />
              <textarea
                required
                placeholder="留言"
                rows={4}
                className="w-full rounded-sm border border-white/15 bg-black/40 px-4 py-3 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-white/40"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-sm border border-white/15 bg-white/[0.03] px-6 py-3 text-xs uppercase tracking-[0.25em] text-neutral-100 transition-all hover:border-white/40 hover:bg-white/[0.08]"
              >
                发送
              </button>
              {sent && (
                <p className="text-sm text-neutral-300">
                  请直接发邮件至 {profile.email}，我会尽快回复 :)
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
