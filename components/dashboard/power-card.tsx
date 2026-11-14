import { BatteryFull, Plug, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { power } from "@/lib/mock/system";

export function PowerCard() {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Plug className="size-4 text-muted-foreground" /> Power
          </CardTitle>
          <CardDescription className="mt-1">Laptop battery acts as a UPS</CardDescription>
        </div>
        <Badge variant="success">
          <Plug /> Running on {power.source}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 pb-5">
        <div className="flex items-center justify-between rounded-xl bg-card-2/60 px-3.5 py-3">
          <span className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Timer className="size-4" /> Uptime
          </span>
          <span className="text-sm font-semibold tabular-nums">{power.uptime}</span>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <BatteryFull className="size-4" /> Battery
            </span>
            <span className="font-semibold tabular-nums">{power.batteryPct}%</span>
          </div>
          <Progress value={power.batteryPct} indicatorClassName="bg-success" />
          <p className="mt-2 text-[11px] text-muted-foreground">{power.backupEstimate} if mains power drops</p>
        </div>
      </CardContent>
    </Card>
  );
}
