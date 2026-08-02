"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type Video = {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  description?: string;
  duration: string;
};

type Provider = "youtube" | "bilibili" | "mp4";

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]{6,})/,
    /youtu\.be\/([\w-]{6,})/,
    /youtube\.com\/embed\/([\w-]{6,})/,
    /youtube\.com\/shorts\/([\w-]{6,})/,
    /youtube\.com\/v\/([\w-]{6,})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function getBilibiliId(url: string): string | null {
  const m = url.match(/bilibili\.com\/video\/(BV[\w]+)/);
  return m ? m[1] : null;
}

function detectProvider(url: string): {
  provider: Provider;
  embedUrl: string | null;
  autoThumb: string | null;
} {
  const yt = getYouTubeId(url);
  if (yt) {
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube.com/embed/${yt}?autoplay=1&rel=0`,
      autoThumb: `https://img.youtube.com/vi/${yt}/hqdefault.jpg`,
    };
  }
  const bv = getBilibiliId(url);
  if (bv) {
    return {
      provider: "bilibili",
      embedUrl: `https://player.bilibili.com/player.html?bvid=${bv}&high_quality=1&autoplay=1`,
      autoThumb: null,
    };
  }
  return { provider: "mp4", embedUrl: null, autoThumb: null };
}

function ProviderBadge({ provider }: { provider: Provider }) {
  const map = {
    youtube: { label: "YouTube", color: "bg-red-600" },
    bilibili: { label: "B站", color: "bg-pink-600" },
    mp4: { label: "MP4", color: "bg-neutral-700" },
  } as const;
  const { label, color } = map[provider];
  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-white", color)}>
      {label}
    </span>
  );
}

export function VideoCard({ video }: { video: Video }) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);

  const { provider, embedUrl, autoThumb } = detectProvider(video.videoUrl);
  const thumb = video.thumbnail || autoThumb || "";
  const isMp4 = provider === "mp4";

  return (
    <>
      <button
        className="group relative block w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] text-left"
        onMouseEnter={() => {
          if (isMp4) {
            setHover(true);
            vidRef.current?.play().catch(() => {});
          }
        }}
        onMouseLeave={() => {
          if (isMp4) {
            setHover(false);
            if (vidRef.current) {
              vidRef.current.pause();
              vidRef.current.currentTime = 0;
            }
          }
        }}
        onClick={() => setOpen(true)}
      >
        <div className="relative aspect-video w-full">
          {thumb ? (
            <Image
              src={thumb}
              alt={video.title}
              fill
              unoptimized
              className={cn(
                "object-cover transition-opacity duration-300",
                hover && isMp4 ? "opacity-30" : "opacity-100"
              )}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-neutral-600">
              无缩略图
            </div>
          )}
          {isMp4 && (
            <video
              ref={vidRef}
              src={video.videoUrl}
              muted
              loop
              playsInline
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                hover ? "opacity-100" : "opacity-0"
              )}
            />
          )}
          <span className="absolute left-3 top-3 z-10">
            <ProviderBadge provider={provider} />
          </span>
          {video.duration && (
            <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-1 text-xs text-white">
              {video.duration}
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm font-medium tracking-wide text-white">{video.title}</p>
          {video.description && (
            <p className="mt-1 line-clamp-2 text-xs text-neutral-400">
              {video.description}
            </p>
          )}
        </div>
      </button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="bg-black">
          <div className="relative aspect-video w-full bg-black">
            {provider === "mp4" ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={video.videoUrl}
                controls
                autoPlay
                className="h-full w-full bg-black"
              />
            ) : (
              <iframe
                src={embedUrl || ""}
                title={video.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          <div className="p-6">
            <p className="text-lg font-medium tracking-wide text-white">{video.title}</p>
            {video.description && (
              <p className="mt-2 text-sm text-neutral-400">{video.description}</p>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
