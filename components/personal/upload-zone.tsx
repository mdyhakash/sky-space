"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CircleCheck, UploadCloud, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn, formatSize } from "@/lib/utils";

interface UploadItem {
  id: string;
  name: string;
  sizeMB: number;
  progress: number;
}

interface UploadZoneProps {
  folderName: string;
  /** Called when a simulated upload reaches 100%. */
  onUploaded: (file: { name: string; sizeMB: number }) => void;
}

/** Drag-and-drop (or click) upload. Nothing leaves the browser – progress is simulated. */
export function UploadZone({ folderName, onUploaded }: UploadZoneProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const finished = useRef<Set<string>>(new Set());

  const addFiles = useCallback((list: FileList | null) => {
    if (!list || list.length === 0) return;
    const next: UploadItem[] = Array.from(list).map((f, i) => ({
      id: `up-${Date.now()}-${i}`,
      name: f.name,
      sizeMB: f.size / 1_000_000,
      progress: 0,
    }));
    setItems((prev) => [...prev, ...next]);
  }, []);

  // Advance progress for anything still uploading.
  useEffect(() => {
    if (!items.some((i) => i.progress < 100)) return;
    const id = setInterval(() => {
      setItems((prev) =>
        prev.map((i) => (i.progress >= 100 ? i : { ...i, progress: Math.min(100, i.progress + 6 + Math.random() * 14) })),
      );
    }, 350);
    return () => clearInterval(id);
  }, [items]);

  // Report completed uploads once, then clear them after a moment.
  useEffect(() => {
    const done = items.filter((i) => i.progress >= 100 && !finished.current.has(i.id));
    if (done.length === 0) return;
    done.forEach((i) => {
      finished.current.add(i.id);
      onUploaded({ name: i.name, sizeMB: i.sizeMB });
    });
    const t = setTimeout(() => setItems((prev) => prev.filter((i) => !finished.current.has(i.id))), 2200);
    return () => clearTimeout(t);
  }, [items, onUploaded]);

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload files to ${folderName}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          dragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 hover:bg-card-2/50",
        )}
      >
        <UploadCloud className={cn("mb-2 size-7", dragging ? "text-primary" : "text-muted-foreground")} />
        <p className="text-sm font-medium">
          Drop files here to upload to <span className="text-primary">{folderName}</span>
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">or click to browse · demo only, nothing is sent anywhere</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {items.length > 0 && (
        <ul className="space-y-2" aria-live="polite">
          {items.map((i) => {
            const done = i.progress >= 100;
            return (
              <li key={i.id} className="surface p-3">
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium">{i.name}</span>
                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                    {done ? <CircleCheck className="size-4 text-success" /> : `${Math.round(i.progress)}%`}
                    {formatSize(i.sizeMB)}
                    {!done && (
                      <button
                        type="button"
                        aria-label={`Cancel ${i.name}`}
                        onClick={() => setItems((prev) => prev.filter((x) => x.id !== i.id))}
                        className="rounded p-0.5 hover:bg-card-2 hover:text-foreground"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </span>
                </div>
                <Progress value={i.progress} indicatorClassName={done ? "bg-success" : undefined} className="h-1.5" />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
