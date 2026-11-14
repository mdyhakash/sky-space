import { Play, Star } from "lucide-react";
import type { Movie } from "@/lib/types";

interface PosterCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export function PosterCard({ movie, onSelect }: PosterCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(movie)}
      className="group text-left focus-visible:outline-none"
      aria-label={`${movie.title}, ${movie.year}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-card-2 transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-glow group-focus-visible:ring-2 group-focus-visible:ring-ring/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={movie.poster} alt="" loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-black">
            <Play className="size-5 translate-x-px fill-current" />
          </span>
        </div>
        {movie.kind === "series" && (
          <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
            Series
          </span>
        )}
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
          <Star className="size-3 fill-warning text-warning" /> {movie.rating.toFixed(1)}
        </span>
      </div>
      <p className="mt-2 truncate text-sm font-medium">{movie.title}</p>
      <p className="truncate text-xs text-muted-foreground">
        {movie.year} · {movie.genre}
      </p>
    </button>
  );
}
