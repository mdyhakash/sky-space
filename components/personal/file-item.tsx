"use client";

import { Ellipsis } from "lucide-react";
import { FileIcon } from "@/components/shared/file-icon";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FileNode } from "@/lib/types";
import { formatDate, formatSize } from "@/lib/utils";
import { FileActionItems, type FileActionHandlers } from "./file-actions";

interface FileItemProps extends FileActionHandlers {
  file: FileNode;
  view: "grid" | "list";
  /** Number of children, for folders. */
  count: number;
}

function MoreMenu({ file, ...handlers }: { file: FileNode } & FileActionHandlers) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" aria-label={`Actions for ${file.name}`} onClick={(e) => e.stopPropagation()}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <FileActionItems file={file} Item={DropdownMenuItem} Separator={DropdownMenuSeparator} {...handlers} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** A single file/folder, rendered as a grid tile or a list row. Right-click for the menu. */
export function FileItem({ file, view, count, ...handlers }: FileItemProps) {
  const meta = file.kind === "folder" ? `${count} item${count === 1 ? "" : "s"}` : formatSize(file.sizeMB);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {view === "grid" ? (
          <div className="group relative surface surface-glow flex flex-col items-center p-4 text-center">
            <button type="button" onClick={() => handlers.onOpen(file)} className="absolute inset-0 rounded-2xl" aria-label={`Open ${file.name}`} />
            <FileIcon kind={file.kind} size="lg" className="mb-3" />
            <p className="w-full truncate text-sm font-medium" title={file.name}>
              {file.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>
            <div className="absolute right-1.5 top-1.5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
              <MoreMenu file={file} {...handlers} />
            </div>
          </div>
        ) : (
          <div className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-card-2/60">
            <button type="button" onClick={() => handlers.onOpen(file)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <FileIcon kind={file.kind} size="sm" />
              <span className="truncate text-sm font-medium">{file.name}</span>
            </button>
            <span className="hidden w-28 shrink-0 text-xs text-muted-foreground sm:block">{formatDate(file.modified)}</span>
            <span className="w-20 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{meta}</span>
            <MoreMenu file={file} {...handlers} />
          </div>
        )}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <FileActionItems file={file} Item={ContextMenuItem} Separator={ContextMenuSeparator} {...handlers} />
      </ContextMenuContent>
    </ContextMenu>
  );
}
