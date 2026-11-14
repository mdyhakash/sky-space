"use client";

import { Check } from "lucide-react";
import type { Photo } from "@/lib/types";
import { cn, formatLongDate } from "@/lib/utils";

interface MasonryGroupProps {
  date: string;
  photos: Photo[];
  selectable?: boolean;
  selected?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onOpen: (photo: Photo) => void;
}

/** One day of photos laid out as a CSS-columns masonry grid. */
export function MasonryGroup({ date, photos, selectable = false, selected, onToggleSelect, onOpen }: MasonryGroupProps) {
  const anySelected = (selected?.size ?? 0) > 0;
  return (
    <section aria-label={formatLongDate(date)} className="mb-8">
      <h2 className="mb-3 flex items-baseline gap-2 text-sm font-semibold">
        {formatLongDate(date)}
        <span className="text-xs font-normal text-muted-foreground">{photos.length} photos</span>
      </h2>
      <div className="columns-2 gap-3 md:columns-3 xl:columns-4">
        {photos.map((p) => {
          const isSelected = selected?.has(p.id) ?? false;
          return (
            <div key={p.id} className="group relative mb-3 break-inside-avoid overflow-hidden rounded-xl bg-card-2">
              <button
                type="button"
                onClick={() => (anySelected && onToggleSelect ? onToggleSelect(p.id) : onOpen(p))}
                aria-label={`Open ${p.title}`}
                className={cn("block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60", isSelected && "ring-2 ring-primary")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumb}
                  alt={p.title}
                  loading="lazy"
                  width={p.width}
                  height={p.height}
                  style={{ aspectRatio: `${p.width} / ${p.height}` }}
                  className={cn("w-full object-cover transition-all duration-300 group-hover:brightness-90", isSelected && "scale-[0.96] rounded-lg")}
                />
              </button>
              {selectable && onToggleSelect && (
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={`Select ${p.title}`}
                  onClick={() => onToggleSelect(p.id)}
                  className={cn(
                    "absolute left-2 top-2 flex size-6 items-center justify-center rounded-full border-2 border-white/80 bg-black/30 text-white backdrop-blur transition-all",
                    isSelected ? "border-primary bg-primary opacity-100" : anySelected ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100",
                  )}
                >
                  {isSelected && <Check className="size-3.5" strokeWidth={3} />}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
