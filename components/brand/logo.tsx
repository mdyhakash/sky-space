import { useId } from "react";
import { cn } from "@/lib/utils";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/** The Akash Space app icon: gradient cloud with a bold "A" on a navy rounded square. */
export function LogoMark({ size = 36, className }: LogoMarkProps) {
  const gradientId = `cloud-${useId().replace(/:/g, "")}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      role="img"
      aria-label="Akash Space"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="56" fill="#0B1220" />
      <g transform="translate(-6,0)" fill={`url(#${gradientId})`}>
        <rect x="64" y="140" width="140" height="48" rx="24" />
        <circle cx="96" cy="142" r="32" />
        <circle cx="136" cy="114" r="44" />
        <circle cx="180" cy="146" r="30" />
      </g>
      <g fill="none" stroke="#0B1220" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
        <path d="M104 174 L128 112 L152 174" />
        <path d="M114 152 L142 152" />
      </g>
    </svg>
  );
}

interface LogoProps {
  /** "mark" = icon only, "full" = icon + wordmark + Bangla subtitle. */
  variant?: "mark" | "full";
  /** Show the "your personal cloud" tagline under the Bangla subtitle. */
  tagline?: boolean;
  size?: number;
  className?: string;
}

export function Logo({ variant = "full", tagline = false, size = 36, className }: LogoProps) {
  if (variant === "mark") return <LogoMark size={size} className={className} />;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoMark size={size} />
      <div className="min-w-0 leading-none">
        <p className="text-[17px] font-bold tracking-tight">
          <span className="text-gradient">Akash</span>
          <span className="ml-1 font-medium text-muted-foreground">Space</span>
        </p>
        <p className="mt-1 font-bangla text-[11px] text-muted-foreground">
          আকাশ স্পেস{tagline ? " · your personal cloud" : ""}
        </p>
      </div>
    </div>
  );
}
