"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Photo } from "@/lib/types";
import { formatLongDate } from "@/lib/utils";

interface LightboxProps {
  photos: Photo[];
  /** Index into `photos`, or null when closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** Hide the share button on the public share page. */
  onShare?: (photo: Photo) => void;
  allowDownload?: boolean;
}

export function Lightbox({ photos, index, onIndexChange, onClose, onShare, allowDownload = true }: LightboxProps) {
  const open = index !== null && photos[index] !== undefined;
  const photo = open ? photos[index] : null;

  // ← / → to move through the gallery
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onIndexChange((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length, onIndexChange]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl gap-0 overflow-hidden border-white/10 bg-black/95 p-0 text-white">
        {photo && index !== null && (
          <>
            <DialogTitle className="sr-only">{photo.title}</DialogTitle>
            <DialogDescription className="sr-only">Photo {index + 1} of {photos.length}</DialogDescription>

            <div className="relative flex min-h-[40vh] items-center justify-center bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={photo.id} src={photo.full} alt={photo.title} className="max-h-[72vh] w-auto max-w-full object-contain" />
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() => onIndexChange((index - 1 + photos.length) % photos.length)}
                    className="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white/20"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() => onIndexChange((index + 1) % photos.length)}
                    className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white/20"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium">{photo.title}</p>
                <p className="text-xs text-white/60">
                  {formatLongDate(photo.takenAt)} · {index + 1} / {photos.length}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {allowDownload && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toast.success(`Downloading ${photo.title}`, { description: "Demo only – no file is actually sent." })}
                  >
                    <Download /> <span className="hidden sm:inline">Download</span>
                  </Button>
                )}
                {onShare && (
                  <Button size="sm" onClick={() => onShare(photo)}>
                    <Share2 /> <span className="hidden sm:inline">Share</span>
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
