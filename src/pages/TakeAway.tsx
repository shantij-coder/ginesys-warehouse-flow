import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/wms/AppHeader";
import SubHeader from "@/components/wms/SubHeader";
import ScanInput from "@/components/wms/ScanInput";
import ScanViewfinder from "@/components/wms/ScanViewfinder";
import DiscardDialog from "@/components/wms/DiscardDialog";
import InlineAlert from "@/components/wms/InlineAlert";
import NumberPickerDialog from "@/components/wms/NumberPickerDialog";
import { Package, Pencil, Trash2, MapPin } from "lucide-react";

interface TAItem {
  id: string;
  name: string;
  sku: string;
  availableQty: number;
  scannedQty: number;
  imageUrl?: string;
}

const demoTAItems: TAItem[] = [
  { id: "1", name: "Nike Air Max 90", sku: "SKU-NKE-AM90-BLK-42", availableQty: 10, scannedQty: 0 },
  { id: "2", name: "Levi's 501 Original Jeans", sku: "SKU-LVS-501-BLU-32", availableQty: 5, scannedQty: 0 },
  { id: "3", name: "Ray-Ban Aviator Classic", sku: "SKU-RBN-AVC-GLD-58", availableQty: 3, scannedQty: 0 },
];

type TAPhase = "mode-select" | "bin-scan" | "item-scan";

const TakeAway = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<TAPhase>("mode-select");
  const [taMode, setTaMode] = useState<"manual" | "suggestive" | null>(null);
  const [binCode, setBinCode] = useState("");
  const [binError, setBinError] = useState("");
  const [items, setItems] = useState<TAItem[]>([]);
  const [scanError, setScanError] = useState("");
  const [viewfinderOpen, setViewfinderOpen] = useState(false);
  const [manualInputMode, setManualInputMode] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [editItem, setEditItem] = useState<TAItem | null>(null);

  const totalScanned = items.reduce((sum, i) => sum + i.scannedQty, 0);
  const hasScannedItems = items.some(i => i.scannedQty > 0);

  // Phase: Mode Selection
  if (phase === "mode-select") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader title="Take Away" showHome />
        <SubHeader />
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-sm animate-float-in rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="text-section text-card-foreground mb-1">Select Mode</h2>
            <p className="text-card-code text-muted-foreground mb-6">Choose how you want to perform Take Away.</p>
            <div className="space-y-3">
              <button
                onClick={() => { setTaMode("manual"); setPhase("bin-scan"); }}
                className="flex w-full items-center gap-3 rounded-xl border-2 border-border px-4 py-4 text-left hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[56px] active:scale-[0.99]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-card-name font-semibold text-card-foreground">MANUAL</p>
                  <p className="text-badge text-muted-foreground">Scan items manually from bin</p>
                </div>
              </button>
              <button
                onClick={() => { setTaMode("suggestive"); setPhase("bin-scan"); }}
                className="flex w-full items-center gap-3 rounded-xl border-2 border-border px-4 py-4 text-left hover:border-info/50 hover:bg-info/5 transition-all min-h-[56px] active:scale-[0.99]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-info/10">
                  <Package className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-card-name font-semibold text-card-foreground">SUGGESTIVE</p>
                  <p className="text-badge text-muted-foreground">System suggests items from bin</p>
                </div>
              </button>
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={() => navigate("/dashboard")} className="px-4 py-2.5 rounded-xl text-card-name font-semibold text-muted-foreground hover:bg-muted transition-colors min-h-[44px]">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phase: Bin Scan
  if (phase === "bin-scan") {
    const handleBinScan = (code: string) => {
      setBinError("");
      setViewfinderOpen(false);
      setManualInputMode(false);

      if (code.toUpperCase().includes("EXT")) { setBinError("Bin is extinct."); return; }
      if (code.toUpperCase().includes("INV")) { setBinError("Bin does not exist in the site you are connected."); return; }
      if (code.toUpperCase().includes("EMPTY")) { setBinError("No stock is available in the bin for take away."); return; }

      setBinCode(code.toUpperCase());
      setItems(demoTAItems);
      setPhase("item-scan");
    };

    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader title={`Bin Scan in ${taMode === "manual" ? "Manual" : "Suggestive"} Mode`} showHome onBack={() => setPhase("mode-select")} />
        <SubHeader />
        <div className="flex-1 p-4 space-y-5">
          <div className="rounded-2xl border bg-card p-5 shadow-card animate-float-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-section font-bold text-card-foreground">Current Bin</h2>
            </div>
            {manualInputMode ? (
              <ScanInput placeholder="Scan or enter bin number" onScan={handleBinScan} onScanIconTap={() => { setManualInputMode(false); setViewfinderOpen(true); }} />
            ) : (
              <button onClick={() => setViewfinderOpen(true)}
                className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-4 text-left hover:border-primary/50 transition-all active:scale-[0.99]">
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
            {binError && <div className="mt-3 animate-card-enter"><InlineAlert type="error" message={binError} onDismiss={() => setBinError("")} /></div>}
          </div>
          {!binError && (
            <div className="flex flex-col items-center gap-4 py-12 text-center animate-fade-in">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/60"><MapPin className="h-10 w-10 text-muted-foreground/30" /></div>
              <p className="text-card-name text-muted-foreground">Scan a bin to see details.</p>
            </div>
          )}
        </div>
        <ScanViewfinder open={viewfinderOpen} scanLabel="SCANNING BIN..." onClose={() => setViewfinderOpen(false)} onScan={handleBinScan} onSwitchToManual={() => { setViewfinderOpen(false); setManualInputMode(true); }} />
      </div>
    );
  }

  // Phase: Item Scan
  const handleItemScan = (barcode: string) => {
    setScanError("");
    setViewfinderOpen(false);

    const existing = items.find(i => i.sku === barcode);
    if (!existing) {
      setScanError("Item not found please select another item.");
      return;
    }
    if (existing.availableQty - existing.scannedQty <= 0) {
      setScanError("There is no quantity pending for the scanned item, please select another item from the list.");
      return;
    }

    setItems(prev => prev.map(i => i.sku === barcode ? { ...i, scannedQty: i.scannedQty + 1 } : i));
  };

  const handleConfirmSave = () => {
    setShowSaveConfirm(false);
    navigate("/takeaway-success", { state: { docNumber: `TA-${Date.now().toString().slice(-6)}`, itemCount: items.filter(i => i.scannedQty > 0).length } });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader title={`Item Scan in ${taMode === "manual" ? "Manual" : "Suggestive"} Mode`} showHome onBack={() => { if (hasScannedItems) setShowExitConfirm(true); else setPhase("bin-scan"); }} />
      <SubHeader />

      <div className="flex items-center justify-between border-b bg-card/60 px-4 py-2.5">
        <span className="text-card-code text-muted-foreground">Bin: <span className="font-mono font-semibold text-card-foreground">{binCode}</span></span>
        <span className="text-card-code text-muted-foreground">Scanned: <span className="font-bold text-primary bg-primary/10 rounded-pill px-1.5 py-0.5">{totalScanned}</span></span>
      </div>

      <div className="border-b bg-card p-4">
        <p className="text-badge font-bold text-primary uppercase tracking-wide mb-2">Scan Item</p>
        {manualInputMode ? (
          <>
            <ScanInput placeholder="No item scanned yet" onScan={handleItemScan} onScanIconTap={() => { setManualInputMode(false); setViewfinderOpen(true); }} />
            {scanError && <div className="mt-2 animate-card-enter"><InlineAlert type="error" message={scanError} onDismiss={() => setScanError("")} /></div>}
          </>
        ) : (
          <button onClick={() => setViewfinderOpen(true)} className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-3.5 text-left hover:border-primary/50 transition-all">
            <span className="text-card-name text-muted-foreground">No item scanned yet</span>
          </button>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {items.map((item, i) => (
          <div key={item.id} className="animate-card-enter rounded-2xl border bg-card shadow-card" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex gap-3 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/60">
                <Package className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-card-name text-card-foreground font-medium">{item.name}</p>
                <p className="font-mono text-card-code text-muted-foreground">{item.sku}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 self-start">
                <span className={`flex min-w-[2rem] items-center justify-center rounded-xl px-2 py-1 text-badge font-bold ${
                  item.availableQty - item.scannedQty > 0 ? "bg-destructive/10 text-destructive" : "bg-muted/60 text-muted-foreground"
                }`}>
                  {item.availableQty - item.scannedQty}
                </span>
                <span className="flex min-w-[2rem] items-center justify-center rounded-xl bg-primary/10 px-2 py-1 text-badge font-bold text-primary">
                  {item.scannedQty}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t px-4 py-2.5">
              <div className="flex gap-3">
                <span className="text-badge text-muted-foreground">Avl: {item.availableQty - item.scannedQty}</span>
                <span className="text-badge text-primary">Scanned: {item.scannedQty}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditItem(item)} className="flex h-10 w-10 min-h-0 min-w-0 items-center justify-center rounded-full bg-warn/15 text-warn hover:bg-warn/25 transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, scannedQty: 0 } : i))}
                  className="flex h-10 w-10 min-h-0 min-w-0 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 border-t bg-card/90 backdrop-blur-sm p-4">
        <button
          onClick={() => setShowSaveConfirm(true)}
          disabled={!hasScannedItems}
          className="w-full rounded-xl bg-primary py-4 text-section font-bold uppercase text-primary-foreground shadow-card active:bg-primary-dark disabled:opacity-40 transition-all min-h-[56px]"
        >
          SAVE
        </button>
      </div>

      <ScanViewfinder open={viewfinderOpen} scanLabel="SCANNING ITEM..." onClose={() => setViewfinderOpen(false)} onScan={handleItemScan} onSwitchToManual={() => { setViewfinderOpen(false); setManualInputMode(true); }} />

      <NumberPickerDialog
        open={!!editItem}
        title="Update Item Qty."
        itemName={editItem?.name}
        itemCode={editItem?.sku}
        initialValue={editItem?.scannedQty || 0}
        max={editItem?.availableQty || 10000}
        onConfirm={(qty) => { if (editItem) { setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, scannedQty: qty } : i)); setEditItem(null); } }}
        onCancel={() => setEditItem(null)}
      />

      <DiscardDialog open={showSaveConfirm} message="Are you sure you want to create take away for the scanned item(s)?" cancelLabel="CANCEL" confirmLabel="CONFIRM" destructive={false} onCancel={() => setShowSaveConfirm(false)} onConfirm={handleConfirmSave} />
      <DiscardDialog open={showExitConfirm} message="Are you sure you want to delete all scanned item(s)?" cancelLabel="CANCEL" confirmLabel="CONFIRM" onCancel={() => setShowExitConfirm(false)} onConfirm={() => { setShowExitConfirm(false); setPhase("bin-scan"); setItems([]); }} />
    </div>
  );
};

export default TakeAway;
