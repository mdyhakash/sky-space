import type { FileNode } from "@/lib/types";

/** Folders first, then A→Z. */
export function childrenOf(files: FileNode[], parentId: string | null): FileNode[] {
  return files
    .filter((f) => f.parentId === parentId)
    .sort((a, b) => {
      if ((a.kind === "folder") !== (b.kind === "folder")) return a.kind === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

/** Root → … → folder, for breadcrumbs. */
export function pathTo(files: FileNode[], id: string | null): FileNode[] {
  const out: FileNode[] = [];
  let cursor = id;
  while (cursor) {
    const node = files.find((f) => f.id === cursor);
    if (!node) break;
    out.unshift(node);
    cursor = node.parentId;
  }
  return out;
}

/** Every descendant id of a folder (used when deleting a folder). */
export function descendantIds(files: FileNode[], id: string): string[] {
  const direct = files.filter((f) => f.parentId === id);
  return direct.flatMap((f) => [f.id, ...descendantIds(files, f.id)]);
}

export function itemCount(files: FileNode[], folderId: string): number {
  return files.filter((f) => f.parentId === folderId).length;
}
