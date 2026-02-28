import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/wms/AppHeader";
import SubHeader from "@/components/wms/SubHeader";
import ScanInput from "@/components/wms/ScanInput";
import ScanViewfinder from "@/components/wms/ScanViewfinder";
import DiscardDialog from "@/components/wms/DiscardDialog";
import InlineAlert from "@/components/wms/InlineAlert";
import { Package, ClipboardList } from "lucide-react";

const demoAssignedLists = [
  { id: "PL-1001", pendingBins: 3, pendingQty: 25 },
  { id: "PL-1002", pendingBins: 1, pendingQty: 8 },
];
const demoUnassignedLists = [
  { id: "PL-2001", pendingBins: 5, pendingQty: 42 },
  { id: "PL-2002", pendingBins: 2, pendingQty: 15 },
];
const demoBins = [
  { id: "BIN-A01", group: "Zone A", pendingQty: 12 },
  { id: "BIN-B03", group: "Zone B", pendingQty: 8 },
  { id: "BIN-C02", group: "Zone C", pendingQty: 5 },
];
const demoPickItems = [
  { id: "1", name: "Nike Air Max 90", sku: "SKU-NKE-AM90-BLK-42", availableQty: 5, scannedQty: 0, imageUrl: "" },
  { id: "2", name: "Levi's 501 Original Jeans", sku: "SKU-LVS-501-BLU-32", availableQty: 3, scannedQty: 0, imageUrl: "" },
  { id: "3", name: "Ray-Ban Aviator Classic", sku: "SKU-RBN-AVC-GLD-58", availableQty: 2, scannedQty: 0, imageUrl: "" },
];

type PLPhase = "list" | "detail" | "scan-items";

const PickList = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<PLPhase>("list");
  const [activeTab, setActiveTab] = useState<"assigned" | "unassigned">("assigned");
  const [selectedPicklist, setSelectedPicklist] = useState("");
  const [selectedBin, setSelectedBin] = useState("");
  const [items, setItems] = useState(demoPickItems);
  const [viewfinderOpen, setViewfinderOpen] = useState(false);
  const [manualInputMode, setManualInputMode] = useState(false);
  const [scanError, setScanError] = useState("");
  const [showAssignConfirm, setShowAssignConfirm] = useState<string | null>(null);
  const [showBinConfirm, setShowBinConfirm] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const totalPending = items.reduce((sum, i) => sum + (i.availableQty - i.scannedQty), 0);
  const hasScannedItems = items.some(i => i.scannedQty > 0);

  // PL-01: Confirm Pick List
  if (phase === "list") {
    const lists = activeTab === "assigned" ? demoAssignedLists : demoUnassignedLists;
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader title="Confirm Pick List" showHome />
        <SubHeader />

        <div className="flex border-b bg-card px-2 gap-1">
          {(["assigned", "unassigned"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-card-name font-semibold uppercase transition-all min-h-[48px] rounded-t-lg ${
                activeTab === tab ? "border-b-[3px] border-primary text-primary bg-primary/5" : "text-muted-foreground hover:text-card-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {lists.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center animate-fade-in">
              <ClipboardList className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-card-name text-muted-foreground">No {activeTab} pick list found</p>
            </div>
          ) : (
            lists.map((pl, i) => (
              <button
                key={pl.id}
                onClick={() => {
                  if (activeTab === "unassigned") {
                    setShowAssignConfirm(pl.id);
                  } else {
                    setSelectedPicklist(pl.id);
                    setPhase("detail");
                  }
                }}
                className="w-full rounded-2xl border bg-card p-4 shadow-card text-left hover:shadow-card-hover transition-all active:scale-[0.99] min-h-[72px] animate-card-enter"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <p className="text-section font-bold text-card-foreground">Pick List No. {pl.id}</p>
                <div className="mt-1.5 flex gap-4">
                  <span className="text-card-code text-muted-foreground">Bins: <span className="font-semibold text-card-foreground">{pl.pendingBins}</span></span>
                  <span className="text-card-code text-muted-foreground">Qty: <span className="font-semibold text-card-foreground">{pl.pendingQty}</span></span>
                </div>
              </button>
            ))
          )}
        </div>

        <DiscardDialog
          open={!!showAssignConfirm}
          message="This picklist will assign to you for pick up."
          cancelLabel="CANCEL"
          confirmLabel="ASSIGN"
          destructive={false}
          onCancel={() => setShowAssignConfirm(null)}
          onConfirm={() => {
            setSelectedPicklist(showAssignConfirm!);
            setShowAssignConfirm(null);
            setPhase("detail");
          }}
        />
      </div>
    );
  }

  // PL-02: Pick List Detail (Scan Bin)
  if (phase === "detail") {
    const handleBinScan = (code: string) => {
      setScanError("");
      setViewfinderOpen(false);
      setManualInputMode(false);

      const matchedBin = demoBins.find(b => b.id === code.toUpperCase());
      if (!matchedBin && !code.toUpperCase().startsWith("BIN")) {
        setScanError("Bin not found in picklist, please scan another bin.");
        return;
      }

      setSelectedBin(code.toUpperCase());
      setItems(demoPickItems);
      setPhase("scan-items");
    };

    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader title="Pick List Detail" showHome onBack={() => setShowExitConfirm(true)} />
        <SubHeader />

        <div className="border-b bg-card/60 px-4 py-3">
          <p className="text-section font-bold text-card-foreground">Pick List No. {selectedPicklist}</p>
          <p className="text-card-code text-muted-foreground mt-0.5">Pending Qty: <span className="font-semibold text-card-foreground">25</span></p>
        </div>

        <div className="border-b bg-card p-4">
          <p className="text-badge font-bold text-primary uppercase tracking-wide mb-2">Scan Bin</p>
          {manualInputMode ? (
            <>
              <ScanInput placeholder="Scan bin barcode" onScan={handleBinScan} onScanIconTap={() => { setManualInputMode(false); setViewfinderOpen(true); }} />
              {scanError && <div className="mt-2 animate-card-enter"><InlineAlert type="error" message={scanError} onDismiss={() => setScanError("")} /></div>}
            </>
          ) : (
            <button onClick={() => setViewfinderOpen(true)} className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-3.5 text-left hover:border-primary/50 transition-all">
              <span className="text-card-name text-muted-foreground">Scan bin barcode</span>
            </button>
          )}
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          <p className="text-badge font-bold text-muted-foreground uppercase tracking-wide mb-2">Or select a bin:</p>
          {demoBins.map((bin, i) => (
            <button
              key={bin.id}
              onClick={() => setShowBinConfirm(bin.id)}
              className="w-full rounded-2xl border bg-card p-4 text-left hover:shadow-card-hover transition-all min-h-[56px] animate-card-enter active:scale-[0.99]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-card-name font-semibold text-card-foreground">{bin.id}</p>
                  <p className="text-badge text-muted-foreground">{bin.group}</p>
                </div>
                <span className="rounded-xl bg-warn/10 px-2.5 py-1 text-badge font-bold text-warn">{bin.pendingQty}</span>
              </div>
            </button>
          ))}
        </div>

        <ScanViewfinder open={viewfinderOpen} scanLabel="SCANNING BIN..." onClose={() => setViewfinderOpen(false)} onScan={handleBinScan} onSwitchToManual={() => { setViewfinderOpen(false); setManualInputMode(true); }} />
        <DiscardDialog open={showExitConfirm} message="Do you want to exit the current picklist?" cancelLabel="NO" confirmLabel="YES" onCancel={() => setShowExitConfirm(false)} onConfirm={() => { setShowExitConfirm(false); setPhase("list"); }} />
        <DiscardDialog
          open={!!showBinConfirm}
          message={`Select Bin. You have selected ${showBinConfirm}. Do you want to continue?`}
          cancelLabel="NO"
          confirmLabel="CONTINUE"
          destructive={false}
          onCancel={() => setShowBinConfirm(null)}
          onConfirm={() => { setSelectedBin(showBinConfirm!); setShowBinConfirm(null); setPhase("scan-items"); }}
        />
      </div>
    );
  }

  // PL-03: Scan Item List
  const handleItemScan = (barcode: string) => {
    setScanError("");
    setViewfinderOpen(false);

    const existing = items.find(i => i.sku === barcode);
    if (!existing) { setScanError("Item not in selected bin/picklist."); return; }
    if (existing.availableQty - existing.scannedQty <= 0) { setScanError("Pending qty is 0 for this item."); return; }

    setItems(prev => {
      const updated = prev.map(i => i.sku === barcode ? { ...i, scannedQty: i.scannedQty + 1 } : i);
      const allDone = updated.every(i => i.scannedQty >= i.availableQty);
      if (allDone) {
        setTimeout(() => {
          navigate("/picklist-success", { state: { docNumber: selectedPicklist, itemCount: updated.length } });
        }, 500);
      }
      return updated;
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader title="Scan Item List" showHome onBack={() => { if (hasScannedItems) setShowExitConfirm(true); else setPhase("detail"); }} />
      <SubHeader />

      <div className="flex items-center justify-between border-b bg-card/60 px-4 py-2.5">
        <span className="text-card-code text-muted-foreground">Bin: <span className="font-mono font-semibold text-card-foreground">{selectedBin}</span></span>
        <span className="text-card-code text-muted-foreground">Pending: <span className="font-bold text-warn bg-warn/10 rounded-pill px-1.5 py-0.5">{totalPending}</span></span>
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
        {items.map((item, i) => (
          <div key={item.id} className="animate-card-enter rounded-2xl border bg-card shadow-card" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex gap-3 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/60">
                <Package className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-card-name font-medium text-card-foreground">{item.name}</p>
                <p className="font-mono text-card-code text-muted-foreground">{item.sku}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 self-start">
                <span className="rounded-xl bg-warn/10 px-2.5 py-1 text-badge font-bold text-warn">
                  {item.availableQty - item.scannedQty}
                </span>
                <span className="rounded-xl bg-primary/10 px-2.5 py-1 text-badge font-bold text-primary">
                  {item.scannedQty}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t px-4 py-2.5">
              <span className="text-badge text-muted-foreground">Left: {item.availableQty - item.scannedQty} · Picked: {item.scannedQty}</span>
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
      <DiscardDialog open={showExitConfirm} message="Do you want to exit the current picklist?" cancelLabel="NO" confirmLabel="YES" onCancel={() => setShowExitConfirm(false)} onConfirm={() => { setShowExitConfirm(false); setPhase("detail"); setItems(demoPickItems); }} />
      <DiscardDialog open={showSaveConfirm} message="Are you sure you want to confirm the picked item(s)?" cancelLabel="CANCEL" confirmLabel="CONFIRM" destructive={false} onCancel={() => setShowSaveConfirm(false)} onConfirm={() => { setShowSaveConfirm(false); navigate("/picklist-success", { state: { docNumber: selectedPicklist, itemCount: items.filter(i => i.scannedQty > 0).length } }); }} />
    </div>
  );
};

export default PickList;
