import {
  Archive,
  Code2,
  FileAudio,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  Image as ImageIcon,
  type LucideIcon,
} from "lucide-react";
import type { FileKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const META: Record<FileKind, { icon: LucideIcon; tint: string }> = {
  folder: { icon: Folder, tint: "bg-primary/12 text-primary" },
  image: { icon: ImageIcon, tint: "bg-success/12 text-success" },
  video: { icon: FileVideo, tint: "bg-indigo/15 text-indigo" },
  audio: { icon: FileAudio, tint: "bg-warning/15 text-warning" },
  pdf: { icon: FileText, tint: "bg-danger/12 text-danger" },
  doc: { icon: FileText, tint: "bg-primary/12 text-primary" },
  sheet: { icon: FileSpreadsheet, tint: "bg-success/12 text-success" },
  archive: { icon: Archive, tint: "bg-warning/15 text-warning" },
  code: { icon: Code2, tint: "bg-indigo/15 text-indigo" },
};

export const KIND_LABEL: Record<FileKind, string> = {
  folder: "Folder",
  image: "Image",
  video: "Video",
  audio: "Audio",
  pdf: "PDF document",
  doc: "Document",
  sheet: "Spreadsheet",
  archive: "Archive",
  code: "Code / data",
};

interface FileIconProps {
  kind: FileKind;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FileIcon({ kind, size = "md", className }: FileIconProps) {
  const { icon: Icon, tint } = META[kind];
  const box = { sm: "size-8 rounded-lg", md: "size-10 rounded-xl", lg: "size-14 rounded-2xl" }[size];
  const glyph = { sm: "size-4", md: "size-5", lg: "size-7" }[size];
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center", box, tint, className)}>
      <Icon className={glyph} />
    </span>
  );
}

/** Guess a FileKind from a real file name (used by the upload simulation). */
export function kindFromName(name: string): FileKind {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "heic"].includes(ext)) return "image";
  if (["mp4", "mkv", "mov", "avi", "webm"].includes(ext)) return "video";
  if (["mp3", "wav", "flac", "m4a", "ogg"].includes(ext)) return "audio";
  if (ext === "pdf") return "pdf";
  if (["xls", "xlsx", "csv"].includes(ext)) return "sheet";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  if (["js", "ts", "tsx", "json", "sql", "py", "html", "css"].includes(ext)) return "code";
  return "doc";
}
