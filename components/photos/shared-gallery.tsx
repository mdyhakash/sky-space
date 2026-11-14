"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Eye, EyeOff, KeyRound, LinkIcon, Lock } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Photo, ShareLink } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Lightbox } from "./lightbox";

interface SharedGalleryProps {
  /** null = the token doesn't match any link. */
  link: ShareLink | null;
  photos: Photo[];
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-end px-4 py-3 sm:px-8">
        <ThemeToggle />
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 sm:px-8">{children}</main>
      {/* Akash Space branding at the bottom */}
      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center">
          <p className="text-xs text-muted-foreground">Shared with</p>
          <Logo tagline size={40} />
        </div>
      </footer>
    </div>
  );
}

function Notice({ icon: Icon, title, text }: { icon: typeof LinkIcon; title: string; text: string }) {
  return (
    <div className="mx-auto mt-16 flex max-w-sm flex-col items-center text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-7" />
      </div>
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!value) {
          toast.error("Enter the link password");
          return;
        }
        onUnlock(); // demo: any password is accepted
      }}
      className="surface mx-auto mt-14 w-full max-w-sm p-7 text-center"
    >
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
        <Lock className="size-6" />
      </div>
      <h1 className="text-lg font-semibold">This gallery is password protected</h1>
      <p className="mt-1 text-sm text-muted-foreground">Ask the person who shared it for the password.</p>
      <div className="mt-5 space-y-1.5 text-left">
        <Label htmlFor="share-pass">Password</Label>
        <div className="relative">
          <Input id="share-pass" type={show ? "text" : "password"} autoFocus className="pr-10" value={value} onChange={(e) => setValue(e.target.value)} />
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow(!show)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" className="mt-4 w-full">
        <KeyRound /> View gallery
      </Button>
    </form>
  );
}

/** Public share page body: clean gallery, no sidebar. */
export function SharedGallery({ link, photos }: SharedGalleryProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const ordered = useMemo(() => [...photos].sort((a, b) => b.takenAt.localeCompare(a.takenAt)), [photos]);

  if (!link) {
    return (
      <Frame>
        <Notice icon={LinkIcon} title="Link not found" text="This share link doesn't exist. Check the address or ask for a new link." />
      </Frame>
    );
  }
  if (link.status === "revoked") {
    return (
      <Frame>
        <Notice icon={LinkIcon} title="This link was revoked" text="The owner turned off sharing, so this gallery is no longer available." />
      </Frame>
    );
  }
  if (link.status === "expired") {
    return (
      <Frame>
        <Notice
          icon={CalendarClock}
          title="This link has expired"
          text={`It stopped working on ${link.expiresAt ? formatDate(link.expiresAt) : "an earlier date"}. Ask for a fresh link.`}
        />
      </Frame>
    );
  }
  if (link.passwordProtected && !unlocked) {
    return (
      <Frame>
        <PasswordGate onUnlock={() => setUnlocked(true)} />
      </Frame>
    );
  }

  return (
    <Frame>
      <div className="mb-6 mt-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{link.itemName}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {ordered.length} photos · shared by @{link.sharedBy}
          {link.expiresAt ? ` · available until ${formatDate(link.expiresAt)}` : ""}
        </p>
      </div>

      <div className="columns-2 gap-3 md:columns-3 xl:columns-4">
        {ordered.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open ${p.title}`}
            className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl bg-card-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.thumb}
              alt={p.title}
              loading="lazy"
              width={p.width}
              height={p.height}
              style={{ aspectRatio: `${p.width} / ${p.height}` }}
              className="w-full object-cover transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-90"
            />
          </button>
        ))}
      </div>

      <Lightbox photos={ordered} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} allowDownload={link.allowDownload} />
    </Frame>
  );
}
