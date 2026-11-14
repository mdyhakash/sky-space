"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { randomToken } from "@/lib/utils";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** What is being shared, e.g. "3 photos" or "Thesis-draft-v4.docx". */
  itemLabel: string;
}

const BASE_URL = "https://space.akash.local/s/";

function isoInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Share modal: generated link + copy, expiry date, optional password, allow-download toggle. */
export function ShareDialog({ open, onOpenChange, itemLabel }: ShareDialogProps) {
  const [token, setToken] = useState("");
  const [expiry, setExpiry] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [allowDownload, setAllowDownload] = useState(true);
  const [copied, setCopied] = useState(false);

  // Fresh link + defaults every time the dialog opens (client-only, so no hydration mismatch).
  useEffect(() => {
    if (!open) return;
    setToken(randomToken(10));
    setExpiry(isoInDays(7));
    setUsePassword(false);
    setPassword("");
    setAllowDownload(true);
    setCopied(false);
  }, [open]);

  const link = `${BASE_URL}${token}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      /* clipboard may be blocked – the toast still confirms the demo action */
    }
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  }

  function create() {
    if (usePassword && password.trim().length < 4) {
      toast.error("Use a password with at least 4 characters");
      return;
    }
    toast.success("Share link is ready", { description: `${itemLabel} · expires ${expiry || "never"}` });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Link2 className="size-5" />
          </div>
          <DialogTitle>Share “{itemLabel}”</DialogTitle>
          <DialogDescription>Anyone with the link can view it – no account needed.</DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="share-link">Share link</Label>
          <div className="flex gap-2">
            <Input id="share-link" readOnly value={link} className="font-mono text-xs" />
            <Button variant="secondary" onClick={copy} className="shrink-0">
              {copied ? <Check className="text-success" /> : <Copy />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="share-expiry">Expiry date</Label>
          <Input id="share-expiry" type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-card-2/50 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label htmlFor="share-pw-toggle">Password protect</Label>
              <p className="text-xs text-muted-foreground">Optional extra step for viewers.</p>
            </div>
            <Switch id="share-pw-toggle" checked={usePassword} onCheckedChange={setUsePassword} />
          </div>
          {usePassword && (
            <Input
              type="text"
              placeholder="Set a link password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
          )}
          <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
            <div>
              <Label htmlFor="share-dl">Allow download</Label>
              <p className="text-xs text-muted-foreground">Viewers can save originals.</p>
            </div>
            <Switch id="share-dl" checked={allowDownload} onCheckedChange={setAllowDownload} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={create}>Create link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
