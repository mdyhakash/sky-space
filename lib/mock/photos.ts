import type { Photo, PhotoAlbum } from "@/lib/types";

export const photoAlbums: PhotoAlbum[] = [
  { id: "sajek", name: "Sajek Valley" },
  { id: "family", name: "Family" },
  { id: "campus", name: "Campus Days" },
  { id: "food", name: "Food & Cafés" },
];

/** [width, height] pairs, cycled so the masonry grid has varied tile heights. */
const SIZES: [number, number][] = [
  [600, 800],
  [800, 600],
  [600, 600],
  [600, 900],
  [900, 600],
  [700, 700],
];

/** Photos per day, newest first. 24 in total. */
const DAYS: { date: string; count: number }[] = [
  { date: "2026-11-12", count: 4 },
  { date: "2026-11-09", count: 3 },
  { date: "2026-11-02", count: 5 },
  { date: "2026-10-24", count: 4 },
  { date: "2026-10-17", count: 3 },
  { date: "2026-10-05", count: 5 },
];

const ALBUM_CYCLE = [["sajek"], ["family"], ["campus"], ["food"], ["sajek", "family"], ["campus", "food"]];

function build(): Photo[] {
  const out: Photo[] = [];
  let n = 0;
  for (const day of DAYS) {
    for (let i = 0; i < day.count; i++) {
      const [w, h] = SIZES[n % SIZES.length];
      out.push({
        id: `p${n + 1}`,
        title: `IMG_${4800 + n}.jpg`,
        thumb: `https://picsum.photos/seed/akash${n + 1}/${w}/${h}`,
        full: `https://picsum.photos/seed/akash${n + 1}/1600/${Math.round((1600 * h) / w)}`,
        width: w,
        height: h,
        takenAt: day.date,
        albumIds: ALBUM_CYCLE[n % ALBUM_CYCLE.length],
      });
      n++;
    }
  }
  return out;
}

export const photos: Photo[] = build();
