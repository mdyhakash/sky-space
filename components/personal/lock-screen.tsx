"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LockScreenProps {
  username: string;
  onUnlock: () => void;
}

/** Re-asks for the password before the personal space opens. Demo: any password works. */
export function LockScreen({ username, onUnlock }: LockScreenProps) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      toast.error("Enter your password to continue");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      toast.success("Personal space unlocked");
      onUnlock();
    }, 450);
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form onSubmit={submit} className="surface w-full max-w-sm p-7 text-center" noValidate>
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
          <Lock className="size-7" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Unlock personal space</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter the password for <span className="font-medium text-foreground">@{username}</span> again to open your private files.
        </p>

        <div className="mt-6 space-y-1.5 text-left">
          <Label htmlFor="unlock-password">Password</Label>
          <div className="relative">
            <Input
              id="unlock-password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              autoFocus
              placeholder="••••••••"
              className="pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" size="lg" className="mt-5 w-full" disabled={busy}>
          <ShieldCheck /> {busy ? "Unlocking…" : "Unlock"}
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">It locks itself again after 10 minutes.</p>
      </form>
    </div>
  );
}
