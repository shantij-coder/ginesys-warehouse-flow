import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/wms/AppHeader";
import SubHeader from "@/components/wms/SubHeader";
import ProfileStatusBar from "@/components/wms/ProfileStatusBar";
import ScanInput from "@/components/wms/ScanInput";
import ScanViewfinder from "@/components/wms/ScanViewfinder";
import DiscardDialog from "@/components/wms/DiscardDialog";
import InlineAlert from "@/components/wms/InlineAlert";
import { MapPin } from "lucide-react";

interface BinDetails {
  code: string;
  availableCapacity: number;
  assortment?: string;
}

const BinScan = () => {
  const navigate = useNavigate();
  const [binDetails, setBinDetails] = useState<BinDetails | null>(null);
  const [error, setError] = useState("");
  const [showDiscard, setShowDiscard] = useState(false);
  const [viewfinderOpen, setViewfinderOpen] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  const processBinScan = (code: string) => {
    setError("");
    setViewfinderOpen(false);
    setManualMode(false);

    if (code.toUpperCase().includes("EXT")) {
      setError("Bin is extinct.");
      return;
    }
    if (code.toUpperCase().includes("INV")) {
      setError("Bin either does not exist or does not belong to connected site.");
      return;
    }

    const details: BinDetails = {
      code: code.toUpperCase(),
      availableCapacity: code.toUpperCase().includes("UNL") ? -1 : Math.floor(Math.random() * 80) + 20,
      assortment: Math.random() > 0.3 ? "Footwear" : undefined,
    };
    setBinDetails(details);

    setTimeout(() => {
      navigate("/item-scan", { state: { bin: details } });
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader title="Bin Scan in Manual Mode" showHome />
      <SubHeader />
      <ProfileStatusBar flags={{ assortmentOverride: true, capacityOverride: false, negativeStockMode: "warn" }} />

      <div className="flex-1 p-4 space-y-5">
        {/* Current Bin Card */}
        <div className="rounded-2xl border bg-card p-5 shadow-card animate-float-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-section font-bold text-card-foreground">Current Bin</h2>
          </div>

          {manualMode ? (
            <ScanInput
              placeholder="Scan or enter bin number"
              onScan={processBinScan}
              onScanIconTap={() => { setManualMode(false); setViewfinderOpen(true); }}
            />
          ) : (
            <button
              onClick={() => setViewfinderOpen(true)}
              className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-4 text-left transition-all hover:border-primary/50 hover:bg-primary/8 active:scale-[0.99]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <div className="relative h-5 w-5">
                  <div className="absolute left-0 top-0 h-1.5 w-1.5 border-l-2 border-t-2 border-primary rounded-tl-sm" />
                  <div className="absolute right-0 top-0 h-1.5 w-1.5 border-r-2 border-t-2 border-primary rounded-tr-sm" />
                  <div className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b-2 border-l-2 border-primary rounded-bl-sm" />
                  <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b-2 border-r-2 border-primary rounded-br-sm" />
                </div>
              </div>
              <span className="text-card-name text-muted-foreground">Tap to scan bin barcode</span>
            </button>
          )}

          {error && (
            <div className="mt-3 animate-card-enter">
              <InlineAlert type="error" message={error} onDismiss={() => setError("")} />
            </div>
          )}

          {/* Bin Details after valid scan */}
          {binDetails && !error && (
            <div className="mt-4 animate-card-enter space-y-3 border-t pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                  <MapPin className="h-5 w-5 text-success" />
                </div>
                <div>
                  <span className="font-mono text-section text-card-foreground">{binDetails.code}</span>
                  <span className="ml-2 rounded-pill bg-success/10 px-2 py-0.5 text-badge font-bold text-success">✓ Valid</span>
                </div>
              </div>
              <div className="rounded-xl bg-muted/50 p-3 space-y-2">
                <div className="flex justify-between text-card-code">
                  <span className="text-muted-foreground">Available Capacity</span>
                  <span className="font-medium text-card-foreground">
                    {binDetails.availableCapacity === -1 ? "Unlimited" : `${binDetails.availableCapacity}`}
                  </span>
                </div>
                {binDetails.assortment && (
                  <div className="flex justify-between text-card-code">
                    <span className="text-muted-foreground">Assortment Name</span>
                    <span className="font-medium text-card-foreground">{binDetails.assortment}</span>
                  </div>
                )}
              </div>
              <p className="text-badge text-primary animate-pulse">Navigating to item scan…</p>
            </div>
          )}
        </div>

        {/* Empty State */}
        {!binDetails && !error && (
          <div className="flex flex-col items-center gap-4 py-12 text-center animate-fade-in">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/60">
              <MapPin className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <p className="text-card-name text-muted-foreground">Scan a bin to see details.</p>
          </div>
        )}
      </div>

      <ScanViewfinder
        open={viewfinderOpen}
        scanLabel="SCANNING BIN..."
        onClose={() => setViewfinderOpen(false)}
        onScan={processBinScan}
        onSwitchToManual={() => { setViewfinderOpen(false); setManualMode(true); }}
      />

      <DiscardDialog
        open={showDiscard}
        message="Are you sure you want to discard the scanned bin configuration?"
        cancelLabel="CANCEL"
        confirmLabel="CONFIRM"
        onCancel={() => setShowDiscard(false)}
        onConfirm={() => navigate("/dashboard")}
      />
    </div>
  );
};

export default BinScan;
