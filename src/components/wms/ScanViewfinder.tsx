import { useState, useEffect } from "react";
import { Keyboard, X } from "lucide-react";

interface ScanViewfinderProps {
  open: boolean;
  scanLabel?: string;
  onClose: () => void;
  onScan: (value: string) => void;
  onSwitchToManual: () => void;
}

const ScanViewfinder = ({ open, scanLabel = "SCANNING...", onClose, onScan, onSwitchToManual }: ScanViewfinderProps) => {
  const [simValue, setSimValue] = useState("");

  useEffect(() => {
    if (!open) setSimValue("");
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (simValue.trim()) {
      onScan(simValue.trim());
      setSimValue("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-badge font-bold text-primary animate-pulse tracking-wider">{scanLabel}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToManual}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15 transition-colors"
          >
            <Keyboard className="h-5 w-5" />
          </button>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Viewfinder area */}
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="relative h-56 w-full max-w-xs">
          {/* Corner brackets */}
          <div className="absolute left-0 top-0 h-10 w-10 border-l-3 border-t-3 border-primary rounded-tl-lg" />
          <div className="absolute right-0 top-0 h-10 w-10 border-r-3 border-t-3 border-primary rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 h-10 w-10 border-b-3 border-l-3 border-primary rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 h-10 w-10 border-b-3 border-r-3 border-primary rounded-br-lg" />

          {/* Animated scan line */}
          <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />

          {/* Center text */}
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <p className="text-sm text-white/50">Point camera at barcode</p>
            <p className="text-badge text-white/30">(Type below to simulate)</p>
          </div>
        </div>
      </div>

      {/* Simulation input */}
      <form onSubmit={handleSubmit} className="px-4 pb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={simValue}
            onChange={(e) => setSimValue(e.target.value)}
            placeholder="Type barcode value…"
            autoFocus
            className="flex-1 rounded-xl border border-primary/30 bg-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button
            type="submit"
            disabled={!simValue.trim()}
            className="rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-30 transition-opacity"
          >
            Scan
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScanViewfinder;
