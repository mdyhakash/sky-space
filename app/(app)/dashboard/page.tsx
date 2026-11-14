"use client";

import { Cpu, MemoryStick, Network, Thermometer } from "lucide-react";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DiskHealthCard } from "@/components/dashboard/disk-health-card";
import { PowerCard } from "@/components/dashboard/power-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StorageCard } from "@/components/dashboard/storage-card";
import { UserStorageTable } from "@/components/dashboard/user-storage-table";
import { useLiveMetrics } from "@/components/dashboard/use-live-metrics";
import { AdminOnly } from "@/components/shared/admin-only";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardSkeleton } from "@/components/shared/skeletons";
import { useSimulatedLoading } from "@/lib/hooks";
import { RAM_TOTAL_GB } from "@/lib/mock/system";

const last = (a: number[]) => a[a.length - 1];

function DashboardView() {
  const m = useLiveMetrics();
  const ramPct = last(m.ram);
  const ramGB = (ramPct / 100) * RAM_TOTAL_GB;
  const tempState = last(m.temp) >= 65 ? "Running warm" : "Normal";

  return (
    <>
      <PageHeader title="Dashboard" description="How your server is doing right now." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="CPU usage"
          icon={Cpu}
          color="#38BDF8"
          value={`${last(m.cpu).toFixed(0)}%`}
          hint="4 cores · 2.4 GHz"
          series={[{ data: m.cpu, color: "#38BDF8" }]}
        />
        <StatCard
          label="RAM"
          icon={MemoryStick}
          color="#6366F1"
          value={`${ramGB.toFixed(1)} GB`}
          hint={`of ${RAM_TOTAL_GB} GB · ${ramPct.toFixed(0)}% used`}
          series={[{ data: m.ram, color: "#6366F1" }]}
        />
        <StatCard
          label="CPU temperature"
          icon={Thermometer}
          color="#FBBF24"
          value={`${last(m.temp).toFixed(0)} °C`}
          hint={tempState}
          series={[{ data: m.temp, color: "#FBBF24" }]}
        />
        <StatCard
          label="Network"
          icon={Network}
          color="#34D399"
          value={
            <span className="text-2xl">
              ↓ {last(m.netDown).toFixed(1)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">Mbps</span>
            </span>
          }
          hint={`↑ ${last(m.netUp).toFixed(1)} Mbps upload`}
          series={[
            { data: m.netDown, color: "#34D399" },
            { data: m.netUp, color: "#38BDF8" },
          ]}
          legend={
            <div className="flex gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-success" /> Download</span>
              <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-primary" /> Upload</span>
            </div>
          }
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <StorageCard />
        </div>
        <div className="grid min-w-0 gap-4">
          <DiskHealthCard />
          <PowerCard />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <UserStorageTable />
        </div>
        <div className="min-w-0">
          <ActivityFeed />
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  const loading = useSimulatedLoading();
  return <AdminOnly>{loading ? <DashboardSkeleton /> : <DashboardView />}</AdminOnly>;
}
