"use client";

import { Download, Pencil, Share2, Trash2 } from "lucide-react";
import { FileIcon, KIND_LABEL } from "@/components/shared/file-icon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { FileNode } from "@/lib/types";
import { formatDate, formatSize } from "@/lib/utils";
import type { FileActionHandlers } from "./file-actions";

interface PreviewDrawerProps extends Omit<FileActionHandlers, "onOpen"> {
  file: FileNode | null;
  /** Human path, e.g. "Documents / Contracts". */
  location: string;
  onClose: () => void;
}

export function PreviewDrawer({ file, location, onClose, ...h }: PreviewDrawerProps) {
  return (
    <Sheet open={file !== null} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        {file && (
          <>
            <SheetHeader>
              <SheetTitle>{file.name}</SheetTitle>
              <SheetDescription>{KIND_LABEL[file.kind]}</SheetDescription>
            </SheetHeader>

            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-border bg-card-2/60">
              {file.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`https://picsum.photos/seed/${file.id}/800/450`} alt={file.name} className="size-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-center">
                  <FileIcon kind={file.kind} size="lg" />
                  <p className="text-xs text-muted-foreground">Preview isn't available in the demo</p>
                </div>
              )}
            </div>

            <dl className="divide-y divide-border rounded-2xl border border-border text-sm">
              {[
                ["Size", formatSize(file.sizeMB)],
                ["Modified", formatDate(file.modified)],
                ["Location", location],
                ["Owner", "You"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="truncate text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-auto grid grid-cols-2 gap-2">
              <Button onClick={() => h.onDownload(file)}>
                <Download /> Download
              </Button>
              <Button variant="secondary" onClick={() => h.onShare(file)}>
                <Share2 /> Share
              </Button>
              <Button variant="outline" onClick={() => h.onRename(file)}>
                <Pencil /> Rename
              </Button>
              <Button variant="destructive" onClick={() => h.onDelete(file)}>
                <Trash2 /> Delete
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
