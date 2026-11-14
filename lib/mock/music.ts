import type { MusicAlbum, Track } from "@/lib/types";

const cover = (n: number) => `https://picsum.photos/seed/album${n}/400/400`;

export const musicAlbums: MusicAlbum[] = [
  { id: "al1", title: "Monsoon Radio", artist: "The Riverside Band", year: 2024, cover: cover(1) },
  { id: "al2", title: "Neon Rickshaw", artist: "Sadia Rahman", year: 2025, cover: cover(2) },
  { id: "al3", title: "Quiet Hours", artist: "Arif & The Lamps", year: 2023, cover: cover(3) },
  { id: "al4", title: "Padma Sessions", artist: "Nila Chowdhury", year: 2022, cover: cover(4) },
  { id: "al5", title: "Tin Roof Lullabies", artist: "Moyna Kabir", year: 2025, cover: cover(5) },
  { id: "al6", title: "Static Bloom", artist: "Daylight Circuit", year: 2024, cover: cover(6) },
  { id: "al7", title: "Chai & Chords", artist: "Faisal Mir", year: 2021, cover: cover(7) },
  { id: "al8", title: "Late Train to Sylhet", artist: "Orin", year: 2026, cover: cover(8) },
  { id: "al9", title: "Hilltop Mixtape", artist: "Various Artists", year: 2023, cover: cover(9) },
  { id: "al10", title: "Blue Hour", artist: "Tahsin & Co.", year: 2025, cover: cover(10) },
];

const t = (id: number, title: string, albumId: string, durationSec: number): Track => ({
  id: `t${id}`,
  title,
  albumId,
  durationSec,
  artist: musicAlbums.find((a) => a.id === albumId)?.artist ?? "Unknown",
});

export const tracks: Track[] = [
  t(1, "Rain on the Tin", "al1", 214),
  t(2, "River Mile Marker", "al1", 187),
  t(3, "Neon Rickshaw", "al2", 201),
  t(4, "Midnight Fare", "al2", 236),
  t(5, "Lamp Light Talk", "al3", 248),
  t(6, "Quiet Hours", "al3", 192),
  t(7, "Where the Padma Bends", "al4", 273),
  t(8, "Slow Boat Home", "al4", 224),
  t(9, "Lullaby for Loadshedding", "al5", 205),
  t(10, "Tin Roof", "al5", 178),
  t(11, "Static Bloom", "al6", 262),
  t(12, "Second Cup", "al7", 196),
  t(13, "Late Train", "al8", 231),
  t(14, "Hilltop Sunrise", "al9", 219),
  t(15, "Blue Hour", "al10", 244),
];
