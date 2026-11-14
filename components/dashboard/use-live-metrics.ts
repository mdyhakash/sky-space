"use client";

import { useEffect, useState } from "react";
import { metricHistory } from "@/lib/mock/system";

export interface LiveMetrics {
  cpu: number[];
  ram: number[];
  temp: number[];
  netUp: number[];
  netDown: number[];
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const walk = (prev: number, step: number, min: number, max: number) =>
  Math.round(clamp(prev + (Math.random() - 0.5) * step * 2, min, max) * 10) / 10;
const push = (arr: number[], next: number) => [...arr.slice(1), next];

/**
 * Starts from the 7-day mock history, then lets the latest value drift every 2s
 * so the cards feel live. Randomness only runs inside the interval (client-only).
 */
export function useLiveMetrics(intervalMs = 2000): LiveMetrics {
  const [m, setM] = useState<LiveMetrics>(() => ({
    cpu: metricHistory.map((h) => h.cpu),
    ram: metricHistory.map((h) => h.ram),
    temp: metricHistory.map((h) => h.temp),
    netUp: metricHistory.map((h) => h.netUp),
    netDown: metricHistory.map((h) => h.netDown),
  }));

  useEffect(() => {
    const id = setInterval(() => {
      setM((p) => ({
        cpu: push(p.cpu, walk(p.cpu[p.cpu.length - 1], 4, 6, 88)),
        ram: push(p.ram, walk(p.ram[p.ram.length - 1], 0.6, 40, 82)),
        temp: push(p.temp, walk(p.temp[p.temp.length - 1], 1, 38, 72)),
        netUp: push(p.netUp, walk(p.netUp[p.netUp.length - 1], 1.2, 0.2, 9)),
        netDown: push(p.netDown, walk(p.netDown[p.netDown.length - 1], 5, 1, 45)),
      }));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return m;
}
