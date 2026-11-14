"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import type { User } from "@/lib/types";
import { formatGB, percent, quotaTone } from "@/lib/utils";

interface QuotaCellProps {
  user: User;
  onChange: (quotaGB: number) => void;
}

const MAX_QUOTA = 2000;

/** Used / allocated with a progress bar. Click the allocated value to edit it inline. */
export function QuotaCell({ user, onChange }: QuotaCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(user.quotaGB));
  const inputRef = useRef<HTMLInputElement>(null);
  const pct = percent(user.usedGB, user.quotaGB);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function commit() {
    const next = Number(draft);
    setEditing(false);
    if (!Number.isFinite(next) || next <= 0) {
      setDraft(String(user.quotaGB));
      toast.error("Enter a valid quota in GB");
      return;
    }
    if (next < Math.ceil(user.usedGB)) {
      setDraft(String(user.quotaGB));
      toast.error(`${user.username} already uses ${formatGB(user.usedGB)}`, { description: "Quota can't be lower than current usage." });
      return;
    }
    const clamped = Math.min(MAX_QUOTA, Math.round(next));
    if (clamped !== user.quotaGB) {
      onChange(clamped);
      toast.success(`Quota for ${user.username} set to ${clamped} GB`);
    }
    setDraft(String(clamped));
  }

  return (
    <div className="min-w-[190px]">
      <div className="mb-1.5 flex items-center justify-between gap-2 text-xs tabular-nums">
        <span className="text-muted-foreground">{formatGB(user.usedGB)} used</span>
        {editing ? (
          <span className="flex items-center gap-1">
            <input
              ref={inputRef}
              type="number"
              min={1}
              max={MAX_QUOTA}
              value={draft}
              aria-label={`Quota for ${user.username} in GB`}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") {
                  setDraft(String(user.quotaGB));
                  setEditing(false);
                }
              }}
              className="h-6 w-16 rounded-md border border-primary/50 bg-card-2 px-1.5 text-right text-xs focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            GB
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(String(user.quotaGB));
              setEditing(true);
            }}
            title="Edit quota"
            className="group flex items-center gap-1 rounded-md px-1 py-0.5 font-medium transition-colors hover:bg-primary/10 hover:text-primary"
          >
            of {user.quotaGB} GB
            <Pencil className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        )}
      </div>
      <Progress value={pct} indicatorClassName={quotaTone(pct)} />
    </div>
  );
}
