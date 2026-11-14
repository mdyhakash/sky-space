import type { Activity, HistoryPoint } from "@/lib/types";
import { users } from "./users";

/* ───────── Disk (2 TB external HDD) ───────── */

export const DISK_TOTAL_GB = 2000;

const otherUsersUsed = users.filter((u) => u.role !== "admin").reduce((sum, u) => sum + u.usedGB, 0);

export const storageBreakdown = [
  { key: "movies", label: "Movies", gb: 540, color: "#38BDF8" },
  { key: "music", label: "Music", gb: 96, color: "#6366F1" },
  { key: "photos", label: "Photos", gb: 248, color: "#34D399" },
  { key: "personal", label: "Personal", gb: users[0].usedGB, color: "#FBBF24" },
  { key: "users", label: "Users", gb: Math.round(otherUsersUsed * 10) / 10, color: "#A78BFA" },
];

export const usedGB = Math.round(storageBreakdown.reduce((s, x) => s + x.gb, 0) * 10) / 10;
export const freeGB = Math.round((DISK_TOTAL_GB - usedGB) * 10) / 10;

/* ───────── 7 days of fake telemetry (deterministic) ───────── */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // 8–14 Nov 2026
const SAMPLES_PER_DAY = 8; // one every 3 hours

function buildHistory(): HistoryPoint[] {
  const rnd = seeded(20261114);
  const out: HistoryPoint[] = [];
  for (let d = 0; d < 7; d++) {
    for (let i = 0; i < SAMPLES_PER_DAY; i++) {
      const hour = i * 3;
      const evening = Math.exp(-Math.pow((hour - 21) / 4, 2)); // streaming peak at night
      const cpu = 12 + 26 * evening + rnd() * 9;
      out.push({
        label: `${DAY_NAMES[d]} ${hour.toString().padStart(2, "0")}:00`,
        cpu: Math.round(cpu * 10) / 10,
        ram: Math.round((46 + d * 0.8 + 10 * evening + rnd() * 5) * 10) / 10,
        temp: Math.round((38 + cpu * 0.35 + rnd() * 3) * 10) / 10,
        netUp: Math.round((0.4 + 5.5 * evening + rnd() * 1.2) * 10) / 10,
        netDown: Math.round((2 + 26 * evening + rnd() * 6) * 10) / 10,
      });
    }
  }
  return out;
}

export const metricHistory: HistoryPoint[] = buildHistory();
export const RAM_TOTAL_GB = 8;

/* ───────── Hardware status ───────── */

export const diskHealth = {
  model: "WD Elements 2 TB (USB 3.0)",
  smart: "Healthy" as const,
  tempC: 36,
  powerOnHours: 12480,
};

export const power = {
  uptime: "23d 14h 06m",
  source: "AC" as const,
  batteryPct: 97,
  backupEstimate: "≈ 2 h 40 m on battery",
};

export const server = {
  hostname: "akash-space-01",
  os: "Ubuntu Server 24.04 LTS",
  kernel: "Linux 6.8.0-48-generic",
  uptime: "23 days, 14 hours",
  version: "v0.1.0 (demo build)",
  hardware: "Old laptop · 8 GB RAM · 2 TB external HDD",
};

/* ───────── Recent activity ───────── */

export const activity: Activity[] = [
  { id: "ac1", type: "login", user: "nusrat", text: "signed in from 192.168.0.24", minutesAgo: 4 },
  { id: "ac2", type: "share", user: "guest", text: "opened share link “Sajek Valley trip”", minutesAgo: 17 },
  { id: "ac3", type: "upload", user: "mim", text: "uploaded 12 photos to Campus Days", minutesAgo: 46 },
  { id: "ac4", type: "download", user: "rafi", text: "downloaded “Midnight Harbor.mkv”", minutesAgo: 118 },
  { id: "ac5", type: "login", user: "akash", text: "signed in from 192.168.0.10", minutesAgo: 192 },
  { id: "ac6", type: "share", user: "guest", text: "opened share link “Campus Days”", minutesAgo: 340 },
  { id: "ac7", type: "upload", user: "nusrat", text: "uploaded Thesis-draft-v4.docx", minutesAgo: 1560 },
  { id: "ac8", type: "login", user: "rafi", text: "signed in from 192.168.0.31", minutesAgo: 1710 },
];
