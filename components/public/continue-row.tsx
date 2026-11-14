import { Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { continueWatching, movies } from "@/lib/mock/movies";
import type { Movie } from "@/lib/types";

interface ContinueRowProps {
  onSelect: (movie: Movie) => void;
}

/** Horizontally scrolling "Continue watching" row. */
export function ContinueRow({ onSelect }: ContinueRowProps) {
  return (
    <section aria-labelledby="continue-heading" className="mb-8">
      <h2 id="continue-heading" className="mb-3 text-base font-semibold">
        Continue watching
      </h2>
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6">
        {continueWatching.map((c) => {
          const movie = movies.find((m) => m.id === c.movieId);
          if (!movie) return null;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(movie)}
              className="group w-64 shrink-0 text-left focus-visible:outline-none sm:w-72"
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-card-2 transition-all group-hover:border-primary/40 group-hover:shadow-glow group-focus-visible:ring-2 group-focus-visible:ring-ring/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.thumb} alt="" loading="lazy" className="size-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="flex size-10 items-center justify-center rounded-full bg-white/90 text-black">
                    <Play className="size-4 translate-x-px fill-current" />
                  </span>
                </div>
                <Progress value={c.progress} className="absolute inset-x-0 bottom-0 h-1 rounded-none bg-black/50" />
              </div>
              <p className="mt-2 truncate text-sm font-medium">{movie.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {c.label} · {c.minutesLeft} min left
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
