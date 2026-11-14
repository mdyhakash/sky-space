"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AutoLockBadgeProps {
  seconds?: number;
  onExpire: () => void;
}

/** Counts down from 10:00, then calls onExpire so the space locks again. */
export function AutoLockBadge({ seconds = 600, onExpire }: AutoLockBadgeProps) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (left <= 0) onExpire();
  }, [left, onExpire]);

  const m = Math.floor(Math.max(left, 0) / 60);
  const s = Math.max(left, 0) % 60;
  return (
    <Badge variant={left <= 60 ? "warning" : "muted"} className="tabular-nums" title="Personal space locks automatically">
      <Timer /> Auto-lock in {m}:{s.toString().padStart(2, "0")}
    </Badge>
  );
}
