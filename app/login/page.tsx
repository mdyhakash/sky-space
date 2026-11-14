"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { useRole } from "@/components/providers/role-provider";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Enter your username and password");
      return;
    }
    setLoading(true);
    // No real auth: any credentials work. "nusrat" previews the User view, anything else is Admin.
    const isUser = username.trim().toLowerCase() === "nusrat";
    setTimeout(() => {
      setRole(isUser ? "user" : "admin");
      toast.success(`Welcome back${isUser ? ", Nusrat" : ""}`);
      router.push(isUser ? "/my-storage" : "/dashboard");
    }, 700);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* soft brand glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[680px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-52 right-[-10%] size-[520px] rounded-full bg-indigo/15 blur-[120px]" />

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <main className="relative w-full max-w-sm animate-fade-up">
        <div className="surface p-7 shadow-2xl sm:p-8">
          <div className="mb-7 flex flex-col items-center text-center">
            <Logo variant="mark" size={64} className="mb-4 drop-shadow-[0_8px_24px_rgba(99,102,241,0.35)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-gradient">Akash</span>
              <span className="ml-1.5 font-medium text-muted-foreground">Space</span>
            </h1>
            <p className="mt-1 font-bangla text-sm text-muted-foreground">আকাশ স্পেস</p>
            <p className="mt-0.5 text-xs text-muted-foreground">your personal cloud</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                autoFocus
                placeholder="your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
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
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <LogIn />}
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">Access is by invitation only.</p>
        </div>

        <p className="mt-5 text-center text-[11px] text-muted-foreground/80">
          Demo build · any credentials work · try <span className="font-mono">nusrat</span> for the User view
        </p>
      </main>
    </div>
  );
}
