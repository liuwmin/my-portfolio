import photos from "@/content/photos.json";
import { MasonryGrid } from "@/components/masonry-grid";

export const metadata = { title: "Photography" };

export default function PhotographyPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <div className="mb-10 flex items-center gap-4">
        <span className="h-10 w-[3px] bg-white/70" />
        <h1 className="text-2xl font-semibold uppercase tracking-[0.2em] text-neutral-100 sm:text-3xl md:text-6xl md:tracking-[0.25em]">
          Photography
        </h1>
      </div>
      <MasonryGrid data={photos.photos} />
    </div>
  );
}
