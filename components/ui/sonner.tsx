"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={resolvedTheme === "light" ? "light" : "dark"}
      position="bottom-right"
      offset={{ bottom: 16, right: 16 }}
      mobileOffset={{ bottom: 84, left: 16, right: 16 }}
      toastOptions={{
        classNames: {
          toast: "!rounded-xl !border-border !bg-card-2 !text-foreground !shadow-xl",
          description: "!text-muted-foreground",
        },
      }}
    />
  );
}
