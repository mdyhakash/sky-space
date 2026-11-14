"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Role, User } from "@/lib/types";
import { DEMO_ADMIN, DEMO_USER } from "@/lib/mock/users";

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  /** The identity shown for the current demo role. */
  currentUser: User;
}

const RoleContext = createContext<RoleContextValue | null>(null);
const STORAGE_KEY = "akash-space:demo-role";

/** "Demo mode": no real auth – the role is just a UI switch persisted in localStorage. */
export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("admin");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "admin" || stored === "user") setRoleState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<RoleContextValue>(
    () => ({
      role,
      setRole: (next) => {
        setRoleState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* ignore */
        }
      },
      currentUser: role === "admin" ? DEMO_ADMIN : DEMO_USER,
    }),
    [role],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside <RoleProvider>");
  return ctx;
}
