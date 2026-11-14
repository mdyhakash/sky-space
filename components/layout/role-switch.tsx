"use client";

import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRole } from "@/components/providers/role-provider";
import { ADMIN_ONLY_PATHS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const OPTIONS: { value: Role; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

/** The "Demo mode" switch: previews both the Admin and User views without real auth. */
export function RoleSwitch() {
  const { role, setRole } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  function change(next: Role) {
    if (next === role) return;
    setRole(next);
    toast.info(`Demo mode: viewing as ${next === "admin" ? "Admin" : "User"}`);
    if (next === "user" && ADMIN_ONLY_PATHS.some((p) => pathname.startsWith(p))) router.push("/my-storage");
    if (next === "admin" && pathname.startsWith("/my-storage")) router.push("/dashboard");
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground lg:block">
        Demo mode
      </span>
      <div role="group" aria-label="Demo mode role" className="flex rounded-xl border border-border bg-card-2/70 p-0.5">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={role === o.value}
            onClick={() => change(o.value)}
            className={cn(
              "rounded-[10px] px-2.5 py-1 text-xs font-medium transition-all",
              role === o.value
                ? "bg-brand-gradient text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
