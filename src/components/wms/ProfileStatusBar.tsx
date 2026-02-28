import { useState } from "react";
import { ChevronDown, ChevronUp, Shield } from "lucide-react";

interface ProfileFlags {
  assortmentOverride: boolean;
  capacityOverride: boolean;
  negativeStockMode: "ignore" | "warn" | "stop";
}

interface ProfileStatusBarProps {
  flags: ProfileFlags;
}

const ProfileStatusBar = ({ flags }: ProfileStatusBarProps) => {
  const [expanded, setExpanded] = useState(false);

  const chipColor = (active: boolean) =>
    active ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20";

  const negStockColor = {
    ignore: "bg-success/10 text-success border-success/20",
    warn: "bg-warn/10 text-warn border-warn/20",
    stop: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className="border-b bg-card/80">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-2 min-h-[40px]"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span className="text-badge text-muted-foreground">Profile Flags</span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      <div className="flex gap-2 px-4 pb-2.5 flex-wrap">
        <span className={`rounded-pill border px-2.5 py-1 text-badge ${chipColor(flags.assortmentOverride)}`}>
          Assortment {flags.assortmentOverride ? "ON" : "OFF"}
        </span>
        <span className={`rounded-pill border px-2.5 py-1 text-badge ${chipColor(flags.capacityOverride)}`}>
          Capacity {flags.capacityOverride ? "ON" : "OFF"}
        </span>
        <span className={`rounded-pill border px-2.5 py-1 text-badge ${negStockColor[flags.negativeStockMode]}`}>
          Neg. Stock {flags.negativeStockMode.toUpperCase()}
        </span>
      </div>

      {expanded && (
        <div className="animate-card-enter space-y-2 border-t px-4 py-3 text-alert text-muted-foreground">
          <p><strong className="text-card-foreground">Assortment Override:</strong> {flags.assortmentOverride ? "Items can be placed in non-tagged bins (Warn)" : "Items restricted to tagged bins only (Stop)"}</p>
          <p><strong className="text-card-foreground">Capacity Override:</strong> {flags.capacityOverride ? "Bins can exceed capacity (Warn)" : "Bins cannot exceed capacity (Stop)"}</p>
          <p><strong className="text-card-foreground">Negative Stock:</strong> {
            flags.negativeStockMode === "ignore" ? "No alerts for negative stock" :
            flags.negativeStockMode === "warn" ? "Amber warning shown, can proceed" :
            "Hard block — cannot proceed"
          }</p>
        </div>
      )}
    </div>
  );
};

export default ProfileStatusBar;
