import {
  Globe,
  HardDrive,
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  Lock,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
}

/** Single source of truth for sidebar + mobile tab bar. */
export const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { href: "/my-storage", label: "My Storage", icon: HardDrive, roles: ["user"] },
  { href: "/personal", label: "Personal Space", icon: Lock, roles: ["admin", "user"] },
  { href: "/public", label: "Public Space", icon: Globe, roles: ["admin", "user"] },
  { href: "/photos", label: "Photos", icon: ImageIcon, roles: ["admin", "user"] },
  { href: "/shared", label: "Shared Links", icon: Link2, roles: ["admin", "user"] },
  { href: "/users", label: "Users", icon: Users, roles: ["admin"] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["admin", "user"] },
];

export const ADMIN_ONLY_PATHS = ["/dashboard", "/users"];

export const navFor = (role: Role): NavItem[] => NAV.filter((i) => i.roles.includes(role));
