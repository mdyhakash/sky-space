"use client";

import { Download, FolderOpen, Pencil, Share2, Trash2 } from "lucide-react";
import type { FileNode } from "@/lib/types";

export interface FileActionHandlers {
  onOpen: (file: FileNode) => void;
  onDownload: (file: FileNode) => void;
  onRename: (file: FileNode) => void;
  onShare: (file: FileNode) => void;
  onDelete: (file: FileNode) => void;
}

type MenuItemComponent = React.ComponentType<{
  onSelect?: () => void;
  destructive?: boolean;
  children?: React.ReactNode;
}>;
type SeparatorComponent = React.ComponentType<Record<string, never>>;

interface FileActionItemsProps extends FileActionHandlers {
  file: FileNode;
  Item: MenuItemComponent;
  Separator: SeparatorComponent;
}

/** One list of actions rendered by both the right-click menu and the "⋯" menu. */
export function FileActionItems({ file, Item, Separator, ...h }: FileActionItemsProps) {
  const isFolder = file.kind === "folder";
  return (
    <>
      <Item onSelect={() => h.onOpen(file)}>
        <FolderOpen /> {isFolder ? "Open" : "Preview"}
      </Item>
      {!isFolder && (
        <Item onSelect={() => h.onDownload(file)}>
          <Download /> Download
        </Item>
      )}
      <Item onSelect={() => h.onRename(file)}>
        <Pencil /> Rename
      </Item>
      {!isFolder && (
        <Item onSelect={() => h.onShare(file)}>
          <Share2 /> Share
        </Item>
      )}
      <Separator />
      <Item destructive onSelect={() => h.onDelete(file)}>
        <Trash2 /> Delete
      </Item>
    </>
  );
}
