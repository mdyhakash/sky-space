"use client";

import { useEffect, useState } from "react";
import { Clock, Play, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import type { Movie } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MovieDialogProps {
  movie: Movie | null;
  onClose: () => void;
}

/** Details for a movie, or season + episode list for a series. Playback is a mockup. */
export function MovieDialog({ movie, onClose }: MovieDialogProps) {
  const [season, setSeason] = useState(1);

  useEffect(() => {
    setSeason(movie?.seasons?.[0]?.number ?? 1);
  }, [movie]);

  const activeSeason = movie?.seasons?.find((s) => s.number === season);

  function play(label: string) {
    toast.info(`Playing ${label}`, { description: "Visual mockup – no video is streamed in the demo." });
  }

  return (
    <Dialog open={movie !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        {movie && (
          <>
            <div className="flex gap-4 pr-6 sm:gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={movie.poster} alt="" className="aspect-[2/3] w-28 shrink-0 rounded-xl border border-border object-cover sm:w-36" />
              <div className="min-w-0">
                <DialogTitle className="text-xl">{movie.title}</DialogTitle>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="muted">{movie.year}</Badge>
                  <Badge variant="default">{movie.genre}</Badge>
                  <Badge variant="warning">
                    <Star className="fill-current" /> {movie.rating.toFixed(1)}
                  </Badge>
                  {movie.durationMin && (
                    <Badge variant="muted">
                      <Clock /> {Math.floor(movie.durationMin / 60)}h {movie.durationMin % 60}m
                    </Badge>
                  )}
                </div>
                <DialogDescription className="mt-3">
                  {movie.kind === "series"
                    ? `A ${movie.genre.toLowerCase()} series from ${movie.year}. ${movie.seasons?.length ?? 0} season${(movie.seasons?.length ?? 0) === 1 ? "" : "s"} stored on your server.`
                    : `A ${movie.genre.toLowerCase()} film from ${movie.year}, stored on your server and ready to stream.`}
                </DialogDescription>
                {movie.kind === "movie" && (
                  <Button className="mt-4" onClick={() => play(movie.title)}>
                    <Play className="fill-current" /> Play
                  </Button>
                )}
              </div>
            </div>

            {movie.kind === "series" && movie.seasons && (
              <div>
                <div className="mb-3 flex gap-2" role="tablist" aria-label="Seasons">
                  {movie.seasons.map((s) => (
                    <button
                      key={s.number}
                      type="button"
                      role="tab"
                      aria-selected={season === s.number}
                      onClick={() => setSeason(s.number)}
                      className={cn(
                        "rounded-full border px-3.5 py-1 text-sm transition-colors",
                        season === s.number
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Season {s.number}
                    </button>
                  ))}
                </div>
                <ul className="divide-y divide-border rounded-2xl border border-border">
                  {activeSeason?.episodes.map((ep) => (
                    <li key={ep.id}>
                      <button
                        type="button"
                        onClick={() => play(`S${season} · E${ep.number} – ${ep.title}`)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-card-2/60"
                      >
                        <span className="w-6 shrink-0 text-sm tabular-nums text-muted-foreground">{ep.number}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{ep.title}</p>
                          {ep.progress !== undefined && ep.progress < 100 && <Progress value={ep.progress} className="mt-1.5 h-1" />}
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {ep.progress === 100 ? "Watched" : `${ep.durationMin} min`}
                        </span>
                        <Play className="size-4 shrink-0 text-muted-foreground" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
