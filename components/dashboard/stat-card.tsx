import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Sparkline, type SparkSeries } from "./sparkline";

interface StatCardProps {
  label: string;
  icon: LucideIcon;
  /** Accent used for the icon tile. */
  color: string;
  /** Main value block – keep it short, e.g. "34%". */
  value: React.ReactNode;
  hint?: string;
  series: SparkSeries[];
  /** Small legend under the chart (used by the two-line network card). */
  legend?: React.ReactNode;
}

export function StatCard({ label, icon: Icon, color, value, hint, series, legend }: StatCardProps) {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}22`, color }}
          >
            <Icon className="size-4" />
          </span>
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-success">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-success" />
          Live
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      </div>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      {legend && <div className="mt-1.5">{legend}</div>}
      <div className="-mx-1 mt-3">
        <Sparkline series={series} />
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground/80">Last 7 days</p>
    </Card>
  );
}
