"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, RefreshCw, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { FOLDER_OPTIONS } from "@/lib/mock/users";
import type { User } from "@/lib/types";
import { cn, generatePassword } from "@/lib/utils";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingUsernames: string[];
  onCreate: (user: User) => void;
}

const MIN_GB = 5;
const MAX_GB = 500;

/** Admin-only: there is no self-registration anywhere in the app. */
export function CreateUserDialog({ open, onOpenChange, existingUsernames, onCreate }: CreateUserDialogProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [quota, setQuota] = useState(50);
  const [folders, setFolders] = useState<string[]>(["movies", "music"]);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!open) return;
    setUsername("");
    setPassword("");
    setShowPw(false);
    setQuota(50);
    setFolders(["movies", "music"]);
    setEnabled(true);
  }, [open]);

  const toggleFolder = (id: string) =>
    setFolders((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(name)) {
      toast.error("Username: 3–20 characters, lowercase letters, numbers or _");
      return;
    }
    if (existingUsernames.includes(name)) {
      toast.error(`“${name}” already exists`);
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    onCreate({
      id: `u${Date.now()}`,
      username: name,
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
      email: `${name}@space.local`,
      role: "user",
      quotaGB: quota,
      usedGB: 0,
      status: enabled ? "active" : "disabled",
      lastLogin: "Never",
      folders,
    });
    toast.success(`User “${name}” created`, { description: `${quota} GB quota · ${folders.length} folders` });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={submit} className="grid gap-4" noValidate>
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus className="size-5" />
            </div>
            <DialogTitle>Create user</DialogTitle>
            <DialogDescription>Invite someone to your server. They sign in with these credentials.</DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor="cu-username">Username</Label>
            <Input
              id="cu-username"
              placeholder="e.g. sumon"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cu-password">Password</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="cu-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  className="pr-10 font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setPassword(generatePassword());
                  setShowPw(true);
                }}
              >
                <RefreshCw /> Generate
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Storage quota</Label>
              <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-sm font-semibold tabular-nums text-primary">{quota} GB</span>
            </div>
            <Slider min={MIN_GB} max={MAX_GB} step={5} value={[quota]} onValueChange={(v) => setQuota(v[0])} aria-label="Storage quota in GB" />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{MIN_GB} GB</span>
              <span>{MAX_GB} GB</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Folders they can access</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {FOLDER_OPTIONS.map((f) => {
                const checked = folders.includes(f.id);
                return (
                  <label
                    key={f.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                      checked ? "border-primary/40 bg-primary/10" : "border-border hover:bg-card-2",
                    )}
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggleFolder(f.id)} />
                    {f.label}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card-2/50 px-3.5 py-3">
            <div>
              <Label htmlFor="cu-enabled">Account enabled</Label>
              <p className="text-xs text-muted-foreground">Disabled users can't sign in.</p>
            </div>
            <Switch id="cu-enabled" checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <UserPlus /> Create user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
