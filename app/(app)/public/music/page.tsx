"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { BackLink } from "@/components/public/back-link";
import { MiniPlayer } from "@/components/public/mini-player";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimulatedLoading } from "@/lib/hooks";
import { musicAlbums, tracks } from "@/lib/mock/music";
import { cn, formatDuration } from "@/lib/utils";

export default function MusicPage() {
  const loading = useSimulatedLoading(550);

  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [queue, setQueue] = useState(tracks);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(70);

  const current = queue[index];
  const currentAlbum = musicAlbums.find((a) => a.id === current?.albumId);
  const listed = useMemo(() => (selectedAlbum ? tracks.filter((t) => t.albumId === selectedAlbum) : tracks), [selectedAlbum]);

  const playIndex = useCallback((i: number) => {
    setIndex(i);
    setPosition(0);
    setPlaying(true);
  }, []);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    playIndex((index + 1) % queue.length);
  }, [index, queue.length, playIndex]);

  const prev = useCallback(() => {
    if (queue.length === 0) return;
    // like most players: restart the track first, go back only if already near the start
    if (position > 3) setPosition(0);
    else playIndex((index - 1 + queue.length) % queue.length);
  }, [index, position, queue.length, playIndex]);

  // Simulated playback clock.
  useEffect(() => {
    if (!playing || !current) return;
    const id = setInterval(() => setPosition((p) => p + 1), 1000);
    return () => clearInterval(id);
  }, [playing, current]);

  useEffect(() => {
    if (current && position >= current.durationSec) next();
  }, [position, current, next]);

  function playAlbum(albumId: string) {
    const albumTracks = tracks.filter((t) => t.albumId === albumId);
    setSelectedAlbum(albumId);
    setQueue(albumTracks);
    setIndex(0);
    setPosition(0);
    setPlaying(true);
  }

  function playTrack(trackId: string) {
    // play inside the list the user is looking at, so "next" follows what's on screen
    const i = listed.findIndex((t) => t.id === trackId);
    setQueue(listed);
    playIndex(i);
  }

  function togglePlay() {
    if (!current) return;
    setPlaying((p) => !p);
  }

  return (
    <>
      <BackLink href="/public">Public Space</BackLink>
      <PageHeader title="Music" description="Visual mockup of the music library – no audio is played." />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }, (_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      ) : (
        <>
          <section aria-labelledby="albums-heading">
            <h2 id="albums-heading" className="mb-3 text-base font-semibold">
              Albums
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {musicAlbums.map((a) => {
                const active = selectedAlbum === a.id;
                return (
                  <button key={a.id} type="button" onClick={() => playAlbum(a.id)} className="group text-left focus-visible:outline-none" aria-label={`Play ${a.title} by ${a.artist}`}>
                    <div
                      className={cn(
                        "relative aspect-square overflow-hidden rounded-2xl border bg-card-2 transition-all group-hover:border-primary/40 group-hover:shadow-glow group-focus-visible:ring-2 group-focus-visible:ring-ring/60",
                        active ? "border-primary/60 shadow-glow" : "border-border",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.cover} alt="" loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <span className="absolute bottom-2 right-2 flex size-10 translate-y-1 items-center justify-center rounded-full bg-brand-gradient text-white opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
                        <Play className="size-4 translate-x-px fill-current" />
                      </span>
                    </div>
                    <p className="mt-2 truncate text-sm font-medium">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.artist} · {a.year}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="tracks-heading" className="mt-8">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 id="tracks-heading" className="text-base font-semibold">
                {selectedAlbum ? musicAlbums.find((a) => a.id === selectedAlbum)?.title : "All tracks"}
              </h2>
              {selectedAlbum && (
                <button type="button" onClick={() => setSelectedAlbum(null)} className="text-sm text-primary hover:underline">
                  Show all tracks
                </button>
              )}
            </div>
            <ul className="surface divide-y divide-border p-1.5">
              {listed.map((t, i) => {
                const isCurrent = current?.id === t.id;
                const album = musicAlbums.find((a) => a.id === t.albumId);
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => playTrack(t.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-card-2/60",
                        isCurrent && "bg-primary/10",
                      )}
                    >
                      <span className="flex w-6 justify-center text-sm tabular-nums text-muted-foreground">
                        {isCurrent && playing ? <Pause className="size-4 fill-current text-primary" /> : isCurrent ? <Play className="size-4 fill-current text-primary" /> : i + 1}
                      </span>
                      {album && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={album.cover} alt="" loading="lazy" className="size-10 shrink-0 rounded-lg object-cover" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className={cn("block truncate text-sm font-medium", isCurrent && "text-primary")}>{t.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">{t.artist}</span>
                      </span>
                      <span className="hidden w-48 truncate text-xs text-muted-foreground md:block">{album?.title}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">{formatDuration(t.durationSec)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      <MiniPlayer
        queue={queue}
        index={index}
        album={currentAlbum}
        playing={playing}
        position={position}
        volume={volume}
        onTogglePlay={togglePlay}
        onPrev={prev}
        onNext={next}
        onSeek={setPosition}
        onVolume={setVolume}
        onPickFromQueue={playIndex}
      />
    </>
  );
}
