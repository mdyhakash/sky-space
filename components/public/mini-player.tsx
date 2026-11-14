"use client";

import { ListMusic, Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import type { MusicAlbum, Track } from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";

interface MiniPlayerProps {
  queue: Track[];
  index: number;
  album: MusicAlbum | undefined;
  playing: boolean;
  position: number;
  volume: number;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (sec: number) => void;
  onVolume: (v: number) => void;
  onPickFromQueue: (index: number) => void;
}

/** Sticky bottom player bar: play/pause, seek, volume, queue. Visual mockup – no audio is played. */
export function MiniPlayer({
  queue,
  index,
  album,
  playing,
  position,
  volume,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolume,
  onPickFromQueue,
}: MiniPlayerProps) {
  const track = queue[index];
  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div className="sticky bottom-[4.75rem] z-30 mt-8 md:bottom-4">
      <div className="rounded-2xl border border-border bg-card/95 p-3 shadow-2xl backdrop-blur-md sm:px-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Now playing */}
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:w-1/4 sm:flex-none">
            {album ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={album.cover} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
            ) : (
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-card-2 text-muted-foreground">
                <ListMusic className="size-5" />
              </div>
            )}
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium">{track?.title ?? "Nothing playing"}</p>
              <p className="truncate text-xs text-muted-foreground">{track?.artist ?? "Pick an album or track"}</p>
            </div>
          </div>

          {/* Transport + seek */}
          <div className="flex flex-col items-center gap-1 sm:flex-1">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" aria-label="Previous track" onClick={onPrev} disabled={!track}>
                <SkipBack className="fill-current" />
              </Button>
              <Button size="icon" className="size-10 rounded-full" aria-label={playing ? "Pause" : "Play"} onClick={onTogglePlay} disabled={!track}>
                {playing ? <Pause className="fill-current" /> : <Play className="translate-x-px fill-current" />}
              </Button>
              <Button variant="ghost" size="icon" aria-label="Next track" onClick={onNext} disabled={!track}>
                <SkipForward className="fill-current" />
              </Button>
            </div>
            <div className="hidden w-full max-w-xl items-center gap-2 sm:flex">
              <span className="w-9 text-right text-[11px] tabular-nums text-muted-foreground">{formatDuration(position)}</span>
              <Slider
                min={0}
                max={track?.durationSec ?? 1}
                step={1}
                value={[track ? position : 0]}
                onValueChange={(v) => onSeek(v[0])}
                disabled={!track}
                aria-label="Seek"
              />
              <span className="w-9 text-[11px] tabular-nums text-muted-foreground">{formatDuration(track?.durationSec ?? 0)}</span>
            </div>
          </div>

          {/* Volume + queue */}
          <div className="flex items-center gap-1 sm:w-1/4 sm:justify-end">
            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                aria-label={volume === 0 ? "Unmute" : "Mute"}
                onClick={() => onVolume(volume === 0 ? 70 : 0)}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground"
              >
                <VolumeIcon className="size-[18px]" />
              </button>
              <Slider className="w-24" min={0} max={100} step={1} value={[volume]} onValueChange={(v) => onVolume(v[0])} aria-label="Volume" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Queue">
                  <ListMusic />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" side="top" className="w-80 p-2">
                <p className="px-2 pb-2 pt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Queue · {queue.length} tracks</p>
                <ul className="max-h-72 overflow-y-auto">
                  {queue.map((t, i) => (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => onPickFromQueue(i)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-primary/10",
                          i === index && "bg-primary/10",
                        )}
                      >
                        <span className="w-5 text-center text-xs tabular-nums text-muted-foreground">{i === index && playing ? "▶" : i + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className={cn("block truncate text-sm", i === index && "font-medium text-primary")}>{t.title}</span>
                          <span className="block truncate text-xs text-muted-foreground">{t.artist}</span>
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">{formatDuration(t.durationSec)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
