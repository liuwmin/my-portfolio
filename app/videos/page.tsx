import videos from "@/content/videos.json";
import { VideoCard } from "@/components/video-card";

export const metadata = { title: "Films" };

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <div className="mb-10 flex items-center gap-4">
        <span className="h-10 w-[3px] bg-white/70" />
        <h1 className="text-4xl font-semibold uppercase tracking-[0.25em] text-neutral-100 md:text-6xl">
          Films
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {videos.videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
}
