import { ScanBarcode, Layers, Package } from "lucide-react";

export type ScanMode = "icode" | "batch" | "set";

interface ScanModeTabsProps {
  activeMode: ScanMode;
  onModeChange: (mode: ScanMode) => void;
}

const tabs: { mode: ScanMode; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { mode: "icode", label: "ICODE / Barcode", shortLabel: "ICODE", icon: <ScanBarcode className="h-4 w-4" /> },
  { mode: "batch", label: "Batch / Serial", shortLabel: "Batch", icon: <Layers className="h-4 w-4" /> },
  { mode: "set", label: "Set Items", shortLabel: "Set", icon: <Package className="h-4 w-4" /> },
];

const ScanModeTabs = ({ activeMode, onModeChange }: ScanModeTabsProps) => {
  return (
    <div className="flex border-b bg-card px-2 gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.mode}
          onClick={() => onModeChange(tab.mode)}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-badge font-semibold transition-all duration-200 min-h-[44px] rounded-t-lg ${
            activeMode === tab.mode
              ? "border-b-[3px] border-primary text-primary bg-primary/5"
              : "text-muted-foreground hover:text-card-foreground hover:bg-muted/50"
          }`}
        >
          {tab.icon}
          <span className="hidden xs:inline">{tab.label}</span>
          <span className="xs:hidden">{tab.shortLabel}</span>
        </button>
      ))}
    </div>
  );
};

export default ScanModeTabs;
