import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

interface HubCardProps {
  href: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  /** Three images shown as a small collage. */
  images: string[];
  stats: string[];
  /** Round cover art for music, portrait posters for movies/photos. */
  shape?: "poster" | "square";
}

export function HubCard({ href, title, subtitle, icon: Icon, images, stats, shape = "poster" }: HubCardProps) {
  return (
    <Link
      href={href}
      className="surface surface-glow group relative flex flex-col overflow-hidden p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      <div className="mb-6 flex h-36 items-end justify-center gap-3" aria-hidden>
        {images.slice(0, 3).map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            loading="lazy"
            className={`w-24 rounded-xl border border-border object-cover shadow-lg transition-transform duration-300 group-hover:-translate-y-1 ${
              shape === "poster" ? "aspect-[2/3]" : "aspect-square"
            } ${i === 1 ? "z-10 -translate-y-3 scale-110 group-hover:-translate-y-4" : "opacity-85"}`}
          />
        ))}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-[18px]" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        {stats.map((s) => (
          <span key={s} className="rounded-full border border-border bg-card-2/60 px-2.5 py-1">
            {s}
          </span>
        ))}
      </div>
    </Link>
  );
}
