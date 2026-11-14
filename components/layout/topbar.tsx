"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { useRole } from "@/components/providers/role-provider";
import { GlobalSearch } from "./global-search";
import { RoleSwitch } from "./role-switch";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function Topbar() {
  const { role } = useRole();
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-md sm:gap-3 sm:px-6">
      <Link href={role === "admin" ? "/dashboard" : "/my-storage"} className="md:hidden" aria-label="Akash Space home">
        <Logo variant="mark" size={34} />
      </Link>
      <div className="flex min-w-0 flex-1">
        <GlobalSearch />
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3">
        <RoleSwitch />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
