"use client";

import { useCallback, useMemo, useState } from "react";
import { ChevronRight, FolderOpen, FolderPlus, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { kindFromName } from "@/components/shared/file-icon";
import { ShareDialog } from "@/components/shared/share-dialog";
import { Button } from "@/components/ui/button";
import type { FileNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { FileActionHandlers } from "./file-actions";
import { FileItem } from "./file-item";
import { childrenOf, descendantIds, itemCount, pathTo } from "./file-helpers";
import { FolderTree } from "./folder-tree";
import { PreviewDrawer } from "./preview-drawer";
import { RenameDialog } from "./rename-dialog";
import { UploadZone } from "./upload-zone";

interface FileManagerProps {
  initialFiles: FileNode[];
  ownerId: string;
}

/** Breadcrumb + folder tree + grid/list + upload + context menu + preview drawer. */
export function FileManager({ initialFiles, ownerId }: FileManagerProps) {
  const [files, setFiles] = useState<FileNode[]>(initialFiles);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"grid" | "list">("grid");
  const [preview, setPreview] = useState<FileNode | null>(null);
  const [renaming, setRenaming] = useState<FileNode | null>(null);
  const [sharing, setSharing] = useState<FileNode | null>(null);
  const [deleting, setDeleting] = useState<FileNode | null>(null);

  const items = useMemo(() => childrenOf(files, currentId), [files, currentId]);
  const crumbs = useMemo(() => pathTo(files, currentId), [files, currentId]);
  const currentName = crumbs.length ? crumbs[crumbs.length - 1].name : "My files";

  const openFolder = useCallback(
    (id: string | null) => {
      setCurrentId(id);
      // make sure the tree shows the path to the folder we just opened
      setExpanded((prev) => {
        const next = new Set(prev);
        pathTo(files, id).forEach((n) => next.add(n.id));
        return next;
      });
    },
    [files],
  );

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const locationOf = (file: FileNode) => {
    const names = pathTo(files, file.parentId).map((n) => n.name);
    return names.length ? names.join(" / ") : "My files";
  };

  const handlers: FileActionHandlers = {
    onOpen: (f) => (f.kind === "folder" ? openFolder(f.id) : setPreview(f)),
    onDownload: (f) => toast.success(`Downloading ${f.name}`, { description: "Demo only – no file is actually sent." }),
    onRename: (f) => setRenaming(f),
    onShare: (f) => setSharing(f),
    onDelete: (f) => setDeleting(f),
  };

  const handleUploaded = useCallback(
    (file: { name: string; sizeMB: number }) => {
      setFiles((prev) => [
        ...prev,
        {
          id: `new-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
          name: file.name,
          kind: kindFromName(file.name),
          sizeMB: file.sizeMB,
          modified: new Date().toISOString().slice(0, 10),
          parentId: currentId,
          ownerId,
        },
      ]);
      toast.success(`Uploaded ${file.name}`);
    },
    [currentId, ownerId],
  );

  function createFolder() {
    let n = 1;
    const taken = new Set(items.map((i) => i.name));
    while (taken.has(n === 1 ? "New folder" : `New folder ${n}`)) n++;
    const name = n === 1 ? "New folder" : `New folder ${n}`;
    const folder: FileNode = {
      id: `folder-${Date.now()}`,
      name,
      kind: "folder",
      sizeMB: 0,
      modified: new Date().toISOString().slice(0, 10),
      parentId: currentId,
      ownerId,
    };
    setFiles((prev) => [...prev, folder]);
    setRenaming(folder);
  }

  function confirmDelete() {
    if (!deleting) return;
    const gone = new Set([deleting.id, ...descendantIds(files, deleting.id)]);
    setFiles((prev) => prev.filter((f) => !gone.has(f.id)));
    if (currentId && gone.has(currentId)) setCurrentId(deleting.parentId);
    if (preview && gone.has(preview.id)) setPreview(null);
    toast.success(`Deleted ${deleting.name}`);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      {/* Folder tree */}
      <aside className="surface hidden max-h-[calc(100vh-14rem)] overflow-y-auto p-3 lg:block">
        <FolderTree files={files} currentId={currentId} expanded={expanded} onToggle={toggleExpanded} onOpen={openFolder} />
      </aside>

      <section className="min-w-0 space-y-4">
        {/* Toolbar: breadcrumb + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-1 text-sm">
            <button
              type="button"
              onClick={() => openFolder(null)}
              className={cn("rounded-md px-1.5 py-0.5 transition-colors hover:bg-card-2", crumbs.length === 0 ? "font-semibold" : "text-muted-foreground")}
            >
              My files
            </button>
            {crumbs.map((c, i) => (
              <span key={c.id} className="flex items-center gap-1">
                <ChevronRight className="size-3.5 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => openFolder(c.id)}
                  className={cn("rounded-md px-1.5 py-0.5 transition-colors hover:bg-card-2", i === crumbs.length - 1 ? "font-semibold" : "text-muted-foreground")}
                >
                  {c.name}
                </button>
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={createFolder}>
              <FolderPlus /> New folder
            </Button>
            <div role="group" aria-label="View" className="flex rounded-xl border border-border bg-card-2/70 p-0.5">
              {(
                [
                  ["grid", LayoutGrid, "Grid view"],
                  ["list", List, "List view"],
                ] as const
              ).map(([value, Icon, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-label={label}
                  aria-pressed={view === value}
                  onClick={() => setView(value)}
                  className={cn(
                    "rounded-[10px] p-1.5 transition-colors",
                    view === value ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <UploadZone folderName={currentName} onUploaded={handleUploaded} />

        {items.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="This folder is empty"
            description="Drop files into the upload area above or create a new folder."
          />
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {items.map((f) => (
              <FileItem key={f.id} file={f} view="grid" count={itemCount(files, f.id)} {...handlers} />
            ))}
          </div>
        ) : (
          <div className="surface divide-y divide-border p-1.5">
            {items.map((f) => (
              <FileItem key={f.id} file={f} view="list" count={itemCount(files, f.id)} {...handlers} />
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">Tip: right-click any item for download, rename, share and delete.</p>
      </section>

      <PreviewDrawer
        file={preview}
        location={preview ? locationOf(preview) : ""}
        onClose={() => setPreview(null)}
        onDownload={handlers.onDownload}
        onRename={handlers.onRename}
        onShare={handlers.onShare}
        onDelete={handlers.onDelete}
      />

      <RenameDialog
        file={renaming}
        onClose={() => setRenaming(null)}
        onRename={(id, name) => {
          setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
          setPreview((p) => (p && p.id === id ? { ...p, name } : p));
          toast.success(`Renamed to ${name}`);
        }}
      />

      <ShareDialog open={sharing !== null} onOpenChange={(o) => !o && setSharing(null)} itemLabel={sharing?.name ?? ""} />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(o) => !o && setDeleting(null)}
        title={`Delete ${deleting?.name ?? "item"}?`}
        description={
          deleting?.kind === "folder"
            ? "This folder and everything inside it will be removed. This can't be undone."
            : "This file will be removed permanently. This can't be undone."
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
