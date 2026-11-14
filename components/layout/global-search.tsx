"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Search, Users as UsersIcon, type LucideIcon } from "lucide-react";
import { useRole } from "@/components/providers/role-provider";
import { FileIcon } from "@/components/shared/file-icon";
import { navFor } from "@/lib/nav";
import { filesByOwner } from "@/lib/mock/files";
import { users } from "@/lib/mock/users";

interface Result {
  key: string;
  label: string;
  hint: string;
  href: string;
  icon: React.ReactNode;
}

const pageIcon = (Icon: LucideIcon) => (
  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
    <Icon className="size-4" />
  </span>
);

/** Top bar search: jumps to pages, your files and (for admins) users. */
export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { role, currentUser } = useRole();

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const pages: Result[] = navFor(role)
      .filter((n) => n.label.toLowerCase().includes(q))
      .map((n) => ({ key: n.href, label: n.label, hint: "Page", href: n.href, icon: pageIcon(n.icon) }));
    const fileHits: Result[] = filesByOwner(currentUser.id)
      .filter((f) => f.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((f) => ({
        key: f.id,
        label: f.name,
        hint: "Personal Space",
        href: "/personal",
        icon: <FileIcon kind={f.kind} size="sm" />,
      }));
    const userHits: Result[] =
      role === "admin"
        ? users
            .filter((u) => u.username.includes(q) || u.displayName.toLowerCase().includes(q))
            .map((u) => ({ key: u.id, label: u.displayName, hint: `@${u.username}`, href: "/users", icon: pageIcon(UsersIcon) }))
        : [];
    return [...pages, ...fileHits, ...userHits].slice(0, 8);
  }, [query, role, currentUser.id]);

  function go(href: string) {
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
    router.push(href);
  }

  const open = focused && query.trim().length > 0;

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results[0]) go(results[0].href);
          if (e.key === "Escape") inputRef.current?.blur();
        }}
        placeholder="Search pages, files, users…"
        aria-label="Search"
        className="h-10 w-full rounded-xl border border-input bg-card-2/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30"
      />
      {open && (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-border bg-card-2 p-1.5 shadow-xl">
          {results.length === 0 ? (
            <p className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
              <FileText className="size-4" /> No results for “{query}”
            </p>
          ) : (
            results.map((r) => (
              <button
                key={r.key}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(r.href)}
                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-primary/10"
              >
                {r.icon}
                <span className="min-w-0 flex-1 truncate text-sm">{r.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{r.hint}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
