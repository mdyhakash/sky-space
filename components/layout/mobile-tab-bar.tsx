"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ellipsis } from "lucide-react";
import { useRole } from "@/components/providers/role-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navFor } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Mobile navigation: four primary tabs + a "More" menu so every sidebar link stays reachable. */
export function MobileTabBar() {
  const pathname = usePathname();
  const { role } = useRole();
  const items = navFor(role);
  const primary = items.slice(0, 4);
  const more = items.slice(4);
  const moreActive = more.some((i) => pathname.startsWith(i.href));

  const tab = (active: boolean) =>
    cn(
      "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors",
      active ? "text-primary" : "text-muted-foreground",
    );

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      {primary.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={tab(active)} aria-current={active ? "page" : undefined}>
            <item.icon className="size-5" />
            <span className="max-w-full truncate px-1">{item.label.replace(" Space", "")}</span>
          </Link>
        );
      })}
      <DropdownMenu>
        <DropdownMenuTrigger className={tab(moreActive)} aria-label="More">
          <Ellipsis className="size-5" />
          <span>More</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" sideOffset={10}>
          {more.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>
                <item.icon /> {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
