import { CircleCheck, Clock, HardDrive, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { diskHealth } from "@/lib/mock/system";

export function DiskHealthCard() {
  const days = Math.round(diskHealth.powerOnHours / 24);
  const rows = [
    { icon: Thermometer, label: "HDD temperature", value: `${diskHealth.tempC} °C`, note: "Normal" },
    { icon: Clock, label: "Power-on hours", value: diskHealth.powerOnHours.toLocaleString("en-US"), note: `≈ ${days} days` },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="size-4 text-muted-foreground" /> Disk health
          </CardTitle>
          <CardDescription className="mt-1">{diskHealth.model}</CardDescription>
        </div>
        <Badge variant="success">
          <CircleCheck /> SMART: {diskHealth.smart}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 pb-5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between rounded-xl bg-card-2/60 px-3.5 py-3">
            <span className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <r.icon className="size-4" /> {r.label}
            </span>
            <span className="text-right">
              <span className="block text-sm font-semibold tabular-nums">{r.value}</span>
              <span className="block text-[11px] text-muted-foreground">{r.note}</span>
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
