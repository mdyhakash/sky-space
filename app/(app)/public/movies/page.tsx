"use client";

import { useState } from "react";
import { Clapperboard } from "lucide-react";
import { BackLink } from "@/components/public/back-link";
import { ContinueRow } from "@/components/public/continue-row";
import { MovieDialog } from "@/components/public/movie-dialog";
import { PosterCard } from "@/components/public/poster-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimulatedLoading } from "@/lib/hooks";
import { movies } from "@/lib/mock/movies";
import type { Movie } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "movie" | "series";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "series", label: "Series" },
];

export default function MoviesPage() {
  const loading = useSimulatedLoading(550);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Movie | null>(null);

  const visible = movies.filter((m) => filter === "all" || m.kind === filter);

  return (
    <>
      <BackLink href="/public">Public Space</BackLink>
      <PageHeader
        title="Movies & Series"
        description="Visual mockup of the media library – playback isn't wired up."
        actions={
          <div role="group" aria-label="Filter" className="flex rounded-xl border border-border bg-card-2/70 p-0.5">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-[10px] px-3 py-1 text-sm transition-colors",
                  filter === f.value ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 12 }, (_, i) => (
            <Skeleton key={i} className="aspect-[2/3]" />
          ))}
        </div>
      ) : (
        <>
          <ContinueRow onSelect={setSelected} />

          <section aria-labelledby="library-heading">
            <h2 id="library-heading" className="mb-3 text-base font-semibold">
              Library
            </h2>
            {visible.length === 0 ? (
              <EmptyState icon={Clapperboard} title="Nothing here yet" description="No titles match this filter." />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                {visible.map((m) => (
                  <PosterCard key={m.id} movie={m} onSelect={setSelected} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <MovieDialog movie={selected} onClose={() => setSelected(null)} />
    </>
  );
}
