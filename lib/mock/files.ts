import type { FileKind, FileNode } from "@/lib/types";

const f = (
  id: string,
  name: string,
  kind: FileKind,
  sizeMB: number,
  modified: string,
  parentId: string | null,
  ownerId: string,
): FileNode => ({ id, name, kind, sizeMB, modified, parentId, ownerId });

const A = "u1"; // admin
const N = "u2"; // demo user

export const files: FileNode[] = [
  // ───────── Admin (akash): root
  f("a-docs", "Documents", "folder", 0, "2026-11-10", null, A),
  f("a-proj", "Projects", "folder", 0, "2026-11-13", null, A),
  f("a-back", "Backups", "folder", 0, "2026-11-01", null, A),
  f("a-study", "Study Materials", "folder", 0, "2026-10-28", null, A),
  f("a-fin", "Finance", "folder", 0, "2026-11-05", null, A),
  f("a-raw", "Raw Footage", "folder", 0, "2026-10-19", null, A),
  f("a-readme", "readme-first.txt", "doc", 0.01, "2026-08-14", null, A),
  f("a-todo", "todo-2026.md", "doc", 0.02, "2026-11-12", null, A),

  // Documents
  f("a-resume", "Resume-2026.pdf", "pdf", 0.8, "2026-11-02", "a-docs", A),
  f("a-notes", "Meeting-notes.docx", "doc", 0.2, "2026-11-10", "a-docs", A),
  f("a-contracts", "Contracts", "folder", 0, "2026-09-30", "a-docs", A),
  f("a-rent", "Rent-agreement.pdf", "pdf", 1.2, "2026-09-30", "a-contracts", A),
  f("a-bill", "Internet-bill-Oct.pdf", "pdf", 0.3, "2026-10-31", "a-contracts", A),
  f("a-warranty", "Laptop-warranty.pdf", "pdf", 0.9, "2026-03-12", "a-contracts", A),

  // Projects
  f("a-p-space", "akash-space", "folder", 0, "2026-11-13", "a-proj", A),
  f("a-p-gear", "gearup", "folder", 0, "2026-10-22", "a-proj", A),
  f("a-p-dhar", "dhar-sodh-backup.zip", "archive", 64, "2026-11-04", "a-proj", A),
  f("a-design", "design-notes.md", "doc", 0.04, "2026-11-13", "a-p-space", A),
  f("a-schema", "schema.sql", "code", 0.05, "2026-11-11", "a-p-space", A),
  f("a-mock", "mock-data.json", "code", 0.3, "2026-11-12", "a-p-space", A),
  f("a-dump", "gearup-db-dump.sql", "code", 84, "2026-10-22", "a-p-gear", A),
  f("a-assets", "gearup-assets.zip", "archive", 312, "2026-10-20", "a-p-gear", A),

  // Backups
  f("a-b-laptop", "laptop-full-2026-10.zip", "archive", 18400, "2026-10-31", "a-back", A),
  f("a-b-phone", "phone-backup-nov.zip", "archive", 6200, "2026-11-01", "a-back", A),
  f("a-b-dot", "dotfiles.tar.gz", "archive", 12, "2026-09-18", "a-back", A),

  // Study
  f("a-dsa", "dsa-cheatsheet.pdf", "pdf", 3.4, "2026-10-02", "a-study", A),
  f("a-sdp", "system-design-primer.pdf", "pdf", 12.8, "2026-09-25", "a-study", A),
  f("a-lect", "lecture-recordings", "folder", 0, "2026-10-28", "a-study", A),
  f("a-l1", "lecture-01.mp4", "video", 842, "2026-10-26", "a-lect", A),
  f("a-l2", "lecture-02.mp4", "video", 790, "2026-10-27", "a-lect", A),
  f("a-l3", "lecture-03.mp4", "video", 915, "2026-10-28", "a-lect", A),

  // Finance
  f("a-budget", "Budget-2026.xlsx", "sheet", 0.4, "2026-11-05", "a-fin", A),
  f("a-tax", "tax-return-2025.pdf", "pdf", 1.1, "2026-07-14", "a-fin", A),
  f("a-stmt", "bkash-statement-oct.csv", "sheet", 0.1, "2026-11-02", "a-fin", A),

  // Raw footage
  f("a-c1", "clip-0912.mp4", "video", 1450, "2026-10-19", "a-raw", A),
  f("a-c2", "clip-0913.mp4", "video", 1210, "2026-10-19", "a-raw", A),
  f("a-vo", "voiceover-take3.wav", "audio", 48, "2026-10-20", "a-raw", A),

  // ───────── Demo user (nusrat)
  f("n-assign", "Assignments", "folder", 0, "2026-11-09", null, N),
  f("n-design", "Design Work", "folder", 0, "2026-11-07", null, N),
  f("n-family", "family-videos-2025.zip", "archive", 61400, "2026-08-02", null, N),
  f("n-photos", "photos-backup.zip", "archive", 48200, "2026-09-14", null, N),
  f("n-laptop", "backup-laptop.zip", "archive", 7664, "2026-10-05", null, N),
  f("n-thesis", "Thesis-draft-v4.docx", "doc", 4.2, "2026-11-09", "n-assign", N),
  f("n-refs", "Research-refs.pdf", "pdf", 18.6, "2026-11-03", "n-assign", N),
  f("n-lect", "lecture-recordings.zip", "archive", 24300, "2026-10-11", "n-assign", N),
  f("n-logo", "logo-pack.zip", "archive", 640, "2026-11-07", "n-design", N),
  f("n-mock", "mockup-final.png", "image", 24, "2026-11-06", "n-design", N),
  f("n-brand", "brand-guide.pdf", "pdf", 38, "2026-11-04", "n-design", N),
  f("n-kit", "ui-kit.fig", "doc", 310, "2026-11-02", "n-design", N),
];

export const filesByOwner = (ownerId: string): FileNode[] =>
  files.filter((x) => x.ownerId === ownerId);
