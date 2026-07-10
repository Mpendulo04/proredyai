import { createContext, useContext, useState, type ReactNode } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

type Device = "desktop" | "mobile";

const Ctx = createContext<{ device: Device; setDevice: (d: Device) => void } | null>(null);

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<Device>("desktop");
  return <Ctx.Provider value={{ device, setDevice }}>{children}</Ctx.Provider>;
}

export function useViewport() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useViewport outside provider");
  return c;
}

export function ViewportToggle() {
  const { device, setDevice } = useViewport();
  return (
    <div className="flex items-center gap-1 rounded-md border bg-background p-0.5">
      <Button
        variant={device === "desktop" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 px-2"
        onClick={() => setDevice("desktop")}
        aria-label="Desktop view"
        title="Desktop view"
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant={device === "mobile" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 px-2"
        onClick={() => setDevice("mobile")}
        aria-label="Mobile view"
        title="Mobile view"
      >
        <Smartphone className="h-4 w-4" />
      </Button>
    </div>
  );
}
