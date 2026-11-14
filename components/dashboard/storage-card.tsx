"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DISK_TOTAL_GB, freeGB, storageBreakdown, usedGB } from "@/lib/mock/system";
import { formatGB, percent } from "@/lib/utils";

export function StorageCard() {
  const { resolvedTheme } = useTheme();
  const freeColor = resolvedTheme === "light" ? "#E2E8F0" : "#22304F";
  const slices = [...storageBreakdown.map((s) => ({ name: s.label, value: s.gb, color: s.color })), { name: "Free", value: freeGB, color: freeColor }];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Storage</CardTitle>
        <CardDescription>2 TB external HDD · {percent(usedGB, DISK_TOTAL_GB)}% used</CardDescription>
      </CardHeader>
      <CardContent className="grid items-center gap-6 pb-6 sm:grid-cols-[220px_1fr]">
        <div className="relative mx-auto h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                innerRadius={68}
                outerRadius={94}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                cornerRadius={4}
                isAnimationActive={false}
              >
                {slices.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => formatGB(Number(v))}
                contentStyle={{
                  background: "rgb(var(--card-2))",
                  border: "1px solid rgb(var(--border) / 0.15)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                itemStyle={{ color: "rgb(var(--foreground))" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold tabular-nums">{formatGB(usedGB)}</span>
            <span className="text-xs text-muted-foreground">of 2.00 TB used</span>
          </div>
        </div>

        <ul className="space-y-3">
          {storageBreakdown.map((s) => (
            <li key={s.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {formatGB(s.gb)} <span className="text-xs">· {percent(s.gb, DISK_TOTAL_GB)}%</span>
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted-foreground/15">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${percent(s.gb, DISK_TOTAL_GB) * 2}%`, backgroundColor: s.color }}
                />
              </div>
            </li>
          ))}
          <li className="flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: freeColor }} />
              Free
            </span>
            <span className="tabular-nums text-muted-foreground">{formatGB(freeGB)}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
