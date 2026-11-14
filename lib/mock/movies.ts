import type { ContinueItem, Episode, Movie, Season } from "@/lib/types";

const poster = (n: number) => `https://picsum.photos/seed/poster${n}/400/600`;

function episodes(prefix: string, titles: string[], baseMin: number, watched: Record<number, number> = {}): Episode[] {
  return titles.map((title, i) => ({
    id: `${prefix}-e${i + 1}`,
    number: i + 1,
    title,
    durationMin: baseMin + ((i * 3) % 7),
    progress: watched[i + 1],
  }));
}

const dhakaNights: Season[] = [
  {
    number: 1,
    episodes: episodes("dn1", ["Last Tram", "Rooftop Rain", "Old Dhaka Maze", "The Night Shift", "Blackout", "Dawn Azaan"], 42, { 1: 100, 2: 100, 3: 100 }),
  },
  {
    number: 2,
    episodes: episodes("dn2", ["Return Ticket", "Paltan Whispers", "Glass Towers", "Static", "River Crossing"], 45, { 1: 100, 2: 38 }),
  },
];

const orbit: Season[] = [
  {
    number: 1,
    episodes: episodes("os1", ["Docking", "Silent Ring", "Dust Protocol", "Signal Lost", "Return Window", "Gravity Well", "Last Orbit"], 36),
  },
];

const kitchen: Season[] = [
  {
    number: 1,
    episodes: episodes("kt1", ["Sunday Rice", "Burnt Milk", "The Guest", "Recipe Book", "Monsoon Khichuri"], 28, { 1: 100 }),
  },
];

export const movies: Movie[] = [
  { id: "m1", title: "Midnight Harbor", year: 2024, genre: "Thriller", rating: 7.8, durationMin: 118, poster: poster(1), kind: "movie" },
  { id: "m2", title: "The Last Monsoon", year: 2023, genre: "Drama", rating: 8.2, durationMin: 132, poster: poster(2), kind: "movie" },
  { id: "m3", title: "Neon Delta", year: 2025, genre: "Sci-Fi", rating: 7.4, durationMin: 109, poster: poster(3), kind: "movie" },
  { id: "m4", title: "Paper Lanterns", year: 2022, genre: "Romance", rating: 7.1, durationMin: 101, poster: poster(4), kind: "movie" },
  { id: "m5", title: "Echoes of Padma", year: 2024, genre: "Drama", rating: 8.0, durationMin: 124, poster: poster(5), kind: "movie" },
  { id: "m6", title: "Cold Summit", year: 2021, genre: "Adventure", rating: 6.9, durationMin: 115, poster: poster(6), kind: "movie" },
  { id: "m7", title: "Stray Signals", year: 2025, genre: "Mystery", rating: 7.6, durationMin: 97, poster: poster(7), kind: "movie" },
  { id: "m8", title: "Golden Hour Heist", year: 2023, genre: "Action", rating: 7.2, durationMin: 126, poster: poster(8), kind: "movie" },
  { id: "m9", title: "Salt & Silence", year: 2022, genre: "Drama", rating: 8.4, durationMin: 139, poster: poster(9), kind: "movie" },
  { id: "s1", title: "Dhaka Nights", year: 2025, genre: "Crime", rating: 8.5, poster: poster(10), kind: "series", seasons: dhakaNights },
  { id: "s2", title: "Orbit Station", year: 2024, genre: "Sci-Fi", rating: 7.9, poster: poster(11), kind: "series", seasons: orbit },
  { id: "s3", title: "The Kitchen Table", year: 2026, genre: "Family", rating: 8.1, poster: poster(12), kind: "series", seasons: kitchen },
];

export const continueWatching: ContinueItem[] = [
  { id: "c1", movieId: "s1", label: "Season 2 · Episode 2", progress: 38, minutesLeft: 28, thumb: "https://picsum.photos/seed/cw1/480/270" },
  { id: "c2", movieId: "m2", label: "Feature film", progress: 64, minutesLeft: 47, thumb: "https://picsum.photos/seed/cw2/480/270" },
  { id: "c3", movieId: "s3", label: "Season 1 · Episode 2", progress: 12, minutesLeft: 25, thumb: "https://picsum.photos/seed/cw3/480/270" },
  { id: "c4", movieId: "m7", label: "Feature film", progress: 81, minutesLeft: 18, thumb: "https://picsum.photos/seed/cw4/480/270" },
];
