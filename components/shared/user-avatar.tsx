import { cn, initials } from "@/lib/utils";

const GRADIENTS = [
  "from-sky-400 to-indigo-500",
  "from-emerald-400 to-sky-500",
  "from-amber-400 to-rose-500",
  "from-violet-400 to-fuchsia-500",
  "from-cyan-400 to-blue-600",
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ name, size = "md", className }: UserAvatarProps) {
  const dims = { sm: "size-7 text-[10px]", md: "size-9 text-xs", lg: "size-14 text-lg" }[size];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white",
        GRADIENTS[hash(name) % GRADIENTS.length],
        dims,
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
