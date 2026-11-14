"use client";

import { useEffect, useState } from "react";
import { KeyRound, Monitor, Moon, Save, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useRole } from "@/components/providers/role-provider";
import { PageHeader } from "@/components/shared/page-header";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { server } from "@/lib/mock/system";
import { cn } from "@/lib/utils";

function ProfileCard() {
  const { currentUser, role } = useRole();
  const [name, setName] = useState(currentUser.displayName);
  const [email, setEmail] = useState(currentUser.email);

  // follow the demo role switch
  useEffect(() => {
    setName(currentUser.displayName);
    setEmail(currentUser.email);
  }, [currentUser]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>How you appear to other people on this server.</CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) {
              toast.error("Display name can't be empty");
              return;
            }
            toast.success("Profile saved");
          }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <UserAvatar name={currentUser.username} size="lg" />
            <div className="leading-tight">
              <p className="font-medium">@{currentUser.username}</p>
              <Badge variant={role === "admin" ? "indigo" : "default"} className="mt-1.5">
                {role === "admin" ? "Admin" : "User"}
              </Badge>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-name">Display name</Label>
            <Input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-email">Email</Label>
            <Input id="pf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit">
            <Save /> Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!current) return toast.error("Enter your current password");
    if (next.length < 8) return toast.error("New password must be at least 8 characters");
    if (next !== confirm) return toast.error("The new passwords don't match");
    toast.success("Password changed", { description: "Demo only – nothing was stored." });
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Use at least 8 characters.</CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pw-current">Current password</Label>
            <Input id="pw-current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw-new">New password</Label>
            <Input id="pw-new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw-confirm">Confirm new password</Label>
            <Input id="pw-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <Button type="submit">
            <KeyRound /> Update password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const THEMES = [
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
] as const;

function ThemeCard() {
  const { resolvedTheme, setTheme } = useTheme();
  // next-themes only knows the real theme after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="size-4 text-muted-foreground" /> Theme
        </CardTitle>
        <CardDescription>Dark is the default. Your choice is remembered in this browser.</CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div role="radiogroup" aria-label="Theme" className="grid grid-cols-2 gap-3">
          {THEMES.map(({ value, label, icon: Icon }) => {
            const active = mounted && resolvedTheme === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTheme(value)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                  active ? "border-primary/50 bg-primary/10" : "border-border hover:bg-card-2",
                )}
              >
                <Icon className={cn("size-5", active ? "text-primary" : "text-muted-foreground")} />
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function AboutServerCard() {
  const rows: [string, string][] = [
    ["Hostname", server.hostname],
    ["Operating system", server.os],
    ["Kernel", server.kernel],
    ["Hardware", server.hardware],
    ["Uptime", server.uptime],
    ["Version", server.version],
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>About server</CardTitle>
        <CardDescription>The machine running Akash Space.</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <dl className="divide-y divide-border">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Your profile, password and appearance." />
      <div className="grid gap-4 xl:grid-cols-2">
        <ProfileCard />
        <PasswordCard />
        <ThemeCard />
        <AboutServerCard />
      </div>
    </>
  );
}
