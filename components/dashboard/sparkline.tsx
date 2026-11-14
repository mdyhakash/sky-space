"use client";

import { useId } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

export interface SparkSeries {
  data: number[];
  color: string;
}

interface SparklineProps {
  series: SparkSeries[];
  height?: number;
}

/** Tiny axis-less area chart used inside the stat cards. */
export function Sparkline({ series, height = 56 }: SparklineProps) {
  const uid = useId().replace(/:/g, "");
  const length = series[0]?.data.length ?? 0;
  const rows: Record<string, number>[] = Array.from({ length }, (_, i) => {
    const row: Record<string, number> = { i };
    series.forEach((s, k) => {
      row[`s${k}`] = s.data[i];
    });
    return row;
  });

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            {series.map((s, k) => (
              <linearGradient key={k} id={`${uid}-${k}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <YAxis hide domain={["dataMin - 4", "dataMax + 4"]} />
          {series.map((s, k) => (
            <Area
              key={k}
              type="monotone"
              dataKey={`s${k}`}
              stroke={s.color}
              strokeWidth={1.75}
              fill={`url(#${uid}-${k})`}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
