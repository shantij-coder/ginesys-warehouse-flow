import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/wms/AppHeader";
import SubHeader from "@/components/wms/SubHeader";
import ScanInput from "@/components/wms/ScanInput";
import ScanViewfinder from "@/components/wms/ScanViewfinder";
import DiscardDialog from "@/components/wms/DiscardDialog";
import InlineAlert from "@/components/wms/InlineAlert";
import NumberPickerDialog from "@/components/wms/NumberPickerDialog";
import { Package, MapPin, ChevronDown, ChevronUp, RotateCcw, Pencil, Lock } from "lucide-react";

interface BCItem {
  id: string;
  name: string;
  sku: string;
  bookQty: number;
  scanQty: number;
  expanded: boolean;
}

const demoBCItems: BCItem[] = [
  { id: "1", name: "Nike Air Max 90", sku: "SKU-NKE-AM90-BLK-42", bookQty: 10, scanQty: 0, expanded: false },
  { id: "2", name: "Levi's 501 Original Jeans", sku: "SKU-LVS-501-BLU-32", bookQty: 5, scanQty: 0, expanded: false },
  { id: "3", name: "Ray-Ban Aviator Classic", sku: "SKU-RBN-AVC-GLD-58", bookQty: 3, scanQty: 0, expanded: false },
  { id: "4", name: "Tommy Hilfiger Polo", sku: "SKU-TMH-PLS-RED-M", bookQty: 8, scanQty: 0, expanded: false },
];

type BCPhase = "bin-scan" | "item-scan";

const BinCount = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<BCPhase>("bin-scan");
  const [binCode, setBinCode] = useState("");
  const [binError, setBinError] = useState("");
  const [items, setItems] = useState<BCItem[]>([]);
  const [scanError, setScanError] = useState("");
  const [viewfinderOpen, setViewfinderOpen] = useState(false);
  const [manualInputMode, setManualInputMode] = useState(false);
  const [showLockConfirm, setShowLockConfirm] = useState<string | null>(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [editItem, setEditItem] = useState<BCItem | null>(null);
  const [showItemNotInList, setShowItemNotInList] = useState<string | null>(null);

  const totalBook = items.reduce((sum, i) => sum + i.bookQty, 0);
  const totalScan = items.reduce((sum, i) => sum + i.scanQty, 0);
  const totalDiff = totalBook - totalScan;

  // BC-01: Bin Scan
  if (phase === "bin-scan") {
    const handleBinScan = (code: string) => {
      setBinError("");
      setViewfinderOpen(false);
      setManualInputMode(false);

      if (code.toUpperCase().includes("EXT")) { setBinError("Bin is extinct."); return; }
      if (code.toUpperCase().includes("INV")) { setBinError("Bin either does not exist or does not belong to connected site."); return; }

      setShowLockConfirm(code.toUpperCase());
    };

    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader title="Bin Count" showHome />
        <SubHeader />
        <div className="flex-1 p-4 space-y-5">
          <div className="rounded-2xl border bg-card p-5 shadow-card animate-float-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-section font-bold text-card-foreground">Scan Bin</h2>
            </div>
            {manualInputMode ? (
              <ScanInput placeholder="Scan or enter bin number" onScan={handleBinScan} onScanIconTap={() => { setManualInputMode(false); setViewfinderOpen(true); }} />
            ) : (
              <button onClick={() => setViewfinderOpen(true)} className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-4 text-left hover:border-primary/50 transition-all active:scale-[0.99]">
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
              <p className="text-card-name text-muted-foreground">Scan a bin to begin counting.</p>
            </div>
          )}
        </div>
        <ScanViewfinder open={viewfinderOpen} scanLabel="SCANNING BIN..." onClose={() => setViewfinderOpen(false)} onScan={handleBinScan} onSwitchToManual={() => { setViewfinderOpen(false); setManualInputMode(true); }} />
        <DiscardDialog
          open={!!showLockConfirm}
          message="Transaction from/to this Bin is not allowed during Bin Count. Do you want to proceed?"
          cancelLabel="CANCEL"
          confirmLabel="CONFIRM"
          destructive={false}
          onCancel={() => setShowLockConfirm(null)}
          onConfirm={() => { setBinCode(showLockConfirm!); setShowLockConfirm(null); setItems(demoBCItems); setPhase("item-scan"); }}
        />
      </div>
    );
  }

  // BC-02: Item Scan + Count
  const handleItemScan = (barcode: string) => {
    setScanError("");
    setViewfinderOpen(false);

    if (barcode.toUpperCase().includes("NOTSITE")) { setScanError("Item does not exist in the site you are connected."); return; }

    const existing = items.find(i => i.sku === barcode);
    if (!existing) {
      setShowItemNotInList(barcode);
      return;
    }

    setItems(prev => prev.map(i => i.sku === barcode ? { ...i, scanQty: i.scanQty + 1 } : i));
  };

  const getDiffColor = (diff: number) => {
    if (diff === 0) return "text-success";
    if (diff > 0) return "text-destructive";
    return "text-warn";
  };

  const getDiffBg = (diff: number) => {
    if (diff === 0) return "bg-success/10";
    if (diff > 0) return "bg-destructive/10";
    return "bg-warn/10";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader title="Bin Count" showHome onBack={() => setShowExitConfirm(true)} />
      <SubHeader />

      <div className="flex items-center justify-between border-b bg-card/60 px-4 py-2.5">
        <span className="flex items-center gap-1.5 text-card-code text-muted-foreground">
          <Lock className="h-3 w-3 text-primary" /> Bin: <span className="font-mono font-semibold text-card-foreground">{binCode}</span>
        </span>
        <span className="text-card-code text-muted-foreground">Book: <span className="font-semibold">{totalBook}</span></span>
        <span className="text-card-code text-muted-foreground">Scan: <span className="font-bold text-primary">{totalScan}</span></span>
        <span className={`text-card-code font-bold rounded-pill px-1.5 py-0.5 ${getDiffColor(totalDiff)} ${getDiffBg(totalDiff)}`}>Diff: {totalDiff}</span>
      </div>

      <div className="border-b bg-card p-4">
        <p className="text-badge font-bold text-primary uppercase tracking-wide mb-2">Scan Item</p>
        {manualInputMode ? (
          <>
            <ScanInput placeholder="Scan item barcode" onScan={handleItemScan} onScanIconTap={() => { setManualInputMode(false); setViewfinderOpen(true); }} />
            {scanError && <div className="mt-2 animate-card-enter"><InlineAlert type="error" message={scanError} onDismiss={() => setScanError("")} /></div>}
          </>
        ) : (
          <button onClick={() => setViewfinderOpen(true)} className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-3.5 text-left hover:border-primary/50 transition-all">
            <span className="text-card-name text-muted-foreground">Scan item barcode</span>
          </button>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {items.map((item, i) => {
          const diff = item.bookQty - item.scanQty;
          return (
            <div key={item.id} className="animate-card-enter rounded-2xl border bg-card shadow-card" style={{ animationDelay: `${i * 40}ms` }}>
              <button
                onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, expanded: !i.expanded } : i))}
                className="flex w-full items-center gap-3 p-4 text-left min-h-0 min-w-0"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/60">
                  <Package className="h-6 w-6 text-muted-foreground/60" />
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <p className="text-card-name font-medium text-card-foreground">{item.name}</p>
                  <p className="font-mono text-card-code text-muted-foreground">{item.sku}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-card-name rounded-xl px-2 py-0.5 ${getDiffColor(diff)} ${getDiffBg(diff)}`}>
                    {diff === 0 ? "✓" : diff > 0 ? `-${diff}` : `+${Math.abs(diff)}`}
                  </span>
                  {item.expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {item.expanded && (
                <div className="border-t px-4 py-3 space-y-3 animate-card-enter">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-muted/40 p-2.5">
                      <p className="text-badge text-muted-foreground">Book Qty</p>
                      <p className="text-section font-bold text-card-foreground">{item.bookQty}</p>
                    </div>
                    <div className="rounded-xl bg-primary/5 p-2.5">
                      <p className="text-badge text-muted-foreground">Scan Qty</p>
                      <p className="text-section font-bold text-primary">{item.scanQty}</p>
                    </div>
                    <div className={`rounded-xl p-2.5 ${getDiffBg(diff)}`}>
                      <p className="text-badge text-muted-foreground">Difference</p>
                      <p className={`text-section font-bold ${getDiffColor(diff)}`}>{diff}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setItems(prev => prev.map(i => i.id === item.id ? { ...i, scanQty: 0 } : i)); }}
                      className="flex h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-badge text-muted-foreground hover:bg-muted transition-colors min-h-0 min-w-0"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> RESET
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditItem(item); }}
                      className="flex h-10 w-10 min-h-0 min-w-0 items-center justify-center rounded-full bg-warn/15 text-warn hover:bg-warn/25 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 border-t bg-card/90 backdrop-blur-sm p-4">
        <button
          onClick={() => setShowSaveConfirm(true)}
          className="w-full rounded-xl bg-primary py-4 text-section font-bold uppercase text-primary-foreground shadow-card active:bg-primary-dark transition-all min-h-[56px]"
        >
          SAVE
        </button>
      </div>

      <ScanViewfinder open={viewfinderOpen} scanLabel="SCANNING ITEM..." onClose={() => setViewfinderOpen(false)} onScan={handleItemScan} onSwitchToManual={() => { setViewfinderOpen(false); setManualInputMode(true); }} />

      <NumberPickerDialog
        open={!!editItem}
        title="Update Scan Qty"
        itemName={editItem?.name}
        itemCode={editItem?.sku}
        initialValue={editItem?.scanQty || 0}
        onConfirm={(qty) => { if (editItem) { setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, scanQty: qty } : i)); setEditItem(null); } }}
        onCancel={() => setEditItem(null)}
      />

      <DiscardDialog open={showSaveConfirm} message="Are you sure you want to confirm the scanned item(s)?" cancelLabel="CANCEL" confirmLabel="CONFIRM" destructive={false} onCancel={() => setShowSaveConfirm(false)} onConfirm={() => { setShowSaveConfirm(false); navigate("/bincount-success", { state: { docNumber: binCode, itemCount: items.length } }); }} />
      <DiscardDialog open={showExitConfirm} message="Are you sure you want to exit? Unsaved audit data will be lost." cancelLabel="CANCEL" confirmLabel="CONFIRM" onCancel={() => setShowExitConfirm(false)} onConfirm={() => { setShowExitConfirm(false); setPhase("bin-scan"); setItems([]); }} />
      <DiscardDialog
        open={!!showItemNotInList}
        message="Item is not in the list still you want to scan?"
        cancelLabel="CANCEL"
        confirmLabel="OK"
        destructive={false}
        onCancel={() => setShowItemNotInList(null)}
        onConfirm={() => {
          if (showItemNotInList) {
            const newItem: BCItem = { id: String(Date.now()), name: `Item (${showItemNotInList})`, sku: showItemNotInList, bookQty: 0, scanQty: 1, expanded: false };
            setItems(prev => [newItem, ...prev]);
          }
          setShowItemNotInList(null);
        }}
      />
    </div>
  );
};

export default BinCount;
