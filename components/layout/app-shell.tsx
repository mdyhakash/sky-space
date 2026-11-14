"use client";

import { usePersistentState } from "@/lib/hooks";
import { MobileTabBar } from "./mobile-tab-bar";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

/** Authenticated layout: collapsible sidebar, top bar, mobile bottom tab bar. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = usePersistentState("akash-space:sidebar-collapsed", false);

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="mx-auto w-full max-w-[1400px] flex-1 animate-fade-up p-4 pb-28 sm:p-6 sm:pb-28 md:pb-10">
          {children}
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
