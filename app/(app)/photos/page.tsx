"use client";

import { useMemo, useState } from "react";
import { Images, Share2, X } from "lucide-react";
import { Lightbox } from "@/components/photos/lightbox";
import { MasonryGroup } from "@/components/photos/masonry-group";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { GallerySkeleton } from "@/components/shared/skeletons";
import { ShareDialog } from "@/components/shared/share-dialog";
import { Button } from "@/components/ui/button";
import { useSimulatedLoading } from "@/lib/hooks";
import { photoAlbums, photos } from "@/lib/mock/photos";
import type { Photo } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function PhotosPage() {
  const loading = useSimulatedLoading();
  const [albumId, setAlbumId] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [shareLabel, setShareLabel] = useState<string | null>(null);

  const visible = useMemo(
    () => (albumId === "all" ? photos : photos.filter((p) => p.albumIds.includes(albumId))),
    [albumId],
  );

  // Group by day, newest first.
  const groups = useMemo(() => {
    const map = new Map<string, Photo[]>();
    for (const p of visible) map.set(p.takenAt, [...(map.get(p.takenAt) ?? []), p]);
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [visible]);

  const albumCount = (id: string) => (id === "all" ? photos.length : photos.filter((p) => p.albumIds.includes(id)).length);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const openPhoto = (photo: Photo) => setLightboxIndex(visible.findIndex((p) => p.id === photo.id));
  const albumName = albumId === "all" ? "All photos" : photoAlbums.find((a) => a.id === albumId)?.name;

  const albumTabs = [{ id: "all", name: "All photos" }, ...photoAlbums];

  return (
    <>
      <PageHeader
        title="Photos"
        description={loading ? "Loading your library…" : `${albumName} · ${visible.length} photos`}
        actions={
          selected.size > 0 ? (
            <>
              <span className="text-sm text-muted-foreground">{selected.size} selected</span>
              <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                <X /> Clear
              </Button>
              <Button size="sm" onClick={() => setShareLabel(`${selected.size} photo${selected.size === 1 ? "" : "s"}`)}>
                <Share2 /> Share
              </Button>
            </>
          ) : (
            !loading && <p className="text-xs text-muted-foreground">Tick the circle on a photo to select several.</p>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        {/* Album sidebar (becomes a scrolling chip row on small screens) */}
        <nav aria-label="Albums" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:sticky lg:top-24 lg:mx-0 lg:block lg:space-y-1 lg:self-start lg:overflow-visible lg:px-0">
          {albumTabs.map((a) => {
            const active = albumId === a.id;
            return (
              <button
                key={a.id}
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => {
                  setAlbumId(a.id);
                  setSelected(new Set());
                }}
                className={cn(
                  "flex shrink-0 items-center justify-between gap-3 rounded-xl border px-3.5 py-2 text-sm transition-colors lg:w-full lg:border-transparent",
                  active ? "border-primary/40 bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:bg-card-2 hover:text-foreground lg:border-transparent",
                )}
              >
                <span className="whitespace-nowrap">{a.name}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{albumCount(a.id)}</span>
              </button>
            );
          })}
        </nav>

        <div className="min-w-0">
          {loading ? (
            <GallerySkeleton />
          ) : groups.length === 0 ? (
            <EmptyState icon={Images} title="No photos in this album" description="Photos you add to this album will show up here." />
          ) : (
            groups.map(([date, list]) => (
              <MasonryGroup key={date} date={date} photos={list} selectable selected={selected} onToggleSelect={toggle} onOpen={openPhoto} />
            ))
          )}
        </div>
      </div>

      <Lightbox
        photos={visible}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onShare={(p) => {
          setLightboxIndex(null); // one modal at a time
          setShareLabel(p.title);
        }}
      />
      <ShareDialog open={shareLabel !== null} onOpenChange={(o) => !o && setShareLabel(null)} itemLabel={shareLabel ?? ""} />
    </>
  );
}
