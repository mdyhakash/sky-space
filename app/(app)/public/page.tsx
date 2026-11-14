"use client";

import { Clapperboard, Image as ImageIcon, Music2 } from "lucide-react";
import { HubCard } from "@/components/public/hub-card";
import { PageHeader } from "@/components/shared/page-header";
import { CardGridSkeleton, HeaderSkeleton } from "@/components/shared/skeletons";
import { useSimulatedLoading } from "@/lib/hooks";
import { movies } from "@/lib/mock/movies";
import { musicAlbums, tracks } from "@/lib/mock/music";
import { photoAlbums, photos } from "@/lib/mock/photos";

export default function PublicHubPage() {
  const loading = useSimulatedLoading(500);

  if (loading) {
    return (
      <>
        <HeaderSkeleton />
        <div className="grid gap-4 lg:grid-cols-3">
          <CardGridSkeleton count={3} className="h-80" />
        </div>
      </>
    );
  }

  const seriesCount = movies.filter((m) => m.kind === "series").length;

  return (
    <>
      <PageHeader title="Public Space" description="Media shared with everyone on this server." />
      <div className="grid gap-4 lg:grid-cols-3">
        <HubCard
          href="/public/movies"
          title="Movies & Series"
          subtitle="Watch from the server, anywhere on your network."
          icon={Clapperboard}
          images={movies.slice(0, 3).map((m) => m.poster)}
          stats={[`${movies.length - seriesCount} movies`, `${seriesCount} series`]}
        />
        <HubCard
          href="/public/music"
          title="Music"
          subtitle="Albums and tracks, with a mini player."
          icon={Music2}
          shape="square"
          images={musicAlbums.slice(0, 3).map((a) => a.cover)}
          stats={[`${musicAlbums.length} albums`, `${tracks.length} tracks`]}
        />
        <HubCard
          href="/photos"
          title="Photos"
          subtitle="Albums, lightbox and share links."
          icon={ImageIcon}
          shape="square"
          images={photos.slice(0, 3).map((p) => p.thumb)}
          stats={[`${photos.length} photos`, `${photoAlbums.length} albums`]}
        />
      </div>
    </>
  );
}
