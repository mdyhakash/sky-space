import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 142.6 -> "142.6 GB", 1329.3 -> "1.33 TB" */
export function formatGB(gb: number, digits = 1): string {
  return gb >= 1000 ? `${(gb / 1000).toFixed(2)} TB` : `${gb.toFixed(digits)} GB`;
}

/** Human size from megabytes (decimal units, like the 2 TB drive label). */
export function formatSize(mb: number): string {
  if (mb <= 0) return "—";
  if (mb >= 1000) return `${(mb / 1000).toFixed(mb >= 10000 ? 0 : 1)} GB`;
  if (mb >= 1) return `${mb >= 100 ? Math.round(mb) : mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(mb * 1000))} KB`;
}

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const longDateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Fixed time zone so server and client render the same text. */
export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function formatLongDate(iso: string): string {
  return longDateFmt.format(new Date(iso));
}

export function formatRelative(minutesAgo: number): string {
  if (minutesAgo < 1) return "just now";
  if (minutesAgo < 60) return `${minutesAgo} min ago`;
  const h = Math.floor(minutesAgo / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  return `${d} d ago`;
}

/** 205 -> "3:25" */
export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function percent(used: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((used / total) * 1000) / 10);
}

/** Tailwind class for a quota bar, based on how full it is. */
export function quotaTone(pct: number): string {
  if (pct >= 90) return "bg-danger";
  if (pct >= 75) return "bg-warning";
  return "bg-brand-gradient";
}

const TOKEN_CHARS = "abcdefghijkmnpqrstuvwxyz23456789";

/** Client-only helpers (call from event handlers / effects, never during render). */
export function randomToken(length = 10): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => TOKEN_CHARS[b % TOKEN_CHARS.length]).join("");
}

export function generatePassword(length = 14): string {
  const set = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => set[b % set.length]).join("");
}

export function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}
