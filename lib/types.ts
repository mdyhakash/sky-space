export type Role = "admin" | "user";

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: Role;
  quotaGB: number;
  usedGB: number;
  status: "active" | "disabled";
  lastLogin: string;
  folders: string[];
}

export type FileKind =
  | "folder"
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "doc"
  | "sheet"
  | "archive"
  | "code";

export interface FileNode {
  id: string;
  name: string;
  kind: FileKind;
  /** Size in megabytes. Folders use 0. */
  sizeMB: number;
  /** ISO date. */
  modified: string;
  parentId: string | null;
  ownerId: string;
}

export interface Photo {
  id: string;
  title: string;
  thumb: string;
  full: string;
  width: number;
  height: number;
  /** ISO date (yyyy-mm-dd). */
  takenAt: string;
  albumIds: string[];
}

export interface PhotoAlbum {
  id: string;
  name: string;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  durationMin: number;
  /** 0-100, only if partly watched. */
  progress?: number;
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: number;
  durationMin?: number;
  poster: string;
  kind: "movie" | "series";
  seasons?: Season[];
}

export interface ContinueItem {
  id: string;
  movieId: string;
  label: string;
  progress: number;
  minutesLeft: number;
  thumb: string;
}

export interface MusicAlbum {
  id: string;
  title: string;
  artist: string;
  year: number;
  cover: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  albumId: string;
  durationSec: number;
}

export type ShareStatus = "active" | "expired" | "revoked";

export interface ShareLink {
  id: string;
  token: string;
  itemName: string;
  itemKind: "album" | "photos";
  createdAt: string;
  views: number;
  /** ISO date or null for "never". */
  expiresAt: string | null;
  status: ShareStatus;
  passwordProtected: boolean;
  allowDownload: boolean;
  photoIds: string[];
  sharedBy: string;
}

export type ActivityType = "login" | "upload" | "share" | "download";

export interface Activity {
  id: string;
  type: ActivityType;
  user: string;
  text: string;
  minutesAgo: number;
}

export interface HistoryPoint {
  label: string;
  cpu: number;
  ram: number;
  temp: number;
  netUp: number;
  netDown: number;
}
