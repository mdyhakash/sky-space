"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";
import { formatGB, percent } from "@/lib/utils";

interface QuotaRingProps {
  usedGB: number;
  quotaGB: number;
}

/** Ring chart of used vs free quota. Turns amber/red as the quota fills up. */
export function QuotaRing({ usedGB, quotaGB }: QuotaRingProps) {
  const { resolvedTheme } = useTheme();
  const pct = percent(usedGB, quotaGB);
  const usedColor = pct >= 90 ? "#F87171" : pct >= 75 ? "#FBBF24" : "#38BDF8";
  const freeColor = resolvedTheme === "light" ? "#E2E8F0" : "#22304F";
  const data = [
    { name: "Used", value: usedGB, color: usedColor },
    { name: "Free", value: Math.max(quotaGB - usedGB, 0), color: freeColor },
  ];

  return (
    <div className="relative mx-auto size-[220px]" role="img" aria-label={`${pct}% of quota used`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={76}
            outerRadius={102}
            startAngle={90}
            endAngle={-270}
            stroke="none"
            cornerRadius={6}
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tabular-nums">{Math.round(pct)}%</span>
        <span className="mt-0.5 text-xs text-muted-foreground">
          {formatGB(usedGB)} of {formatGB(quotaGB, 0)}
        </span>
      </div>
    </div>
  );
}
