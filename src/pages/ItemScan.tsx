import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppHeader from "@/components/wms/AppHeader";
import SubHeader from "@/components/wms/SubHeader";
import ScanModeTabs, { type ScanMode } from "@/components/wms/ScanModeTabs";
import ScanInput from "@/components/wms/ScanInput";
import ScanViewfinder from "@/components/wms/ScanViewfinder";
import InlineAlert from "@/components/wms/InlineAlert";
import FloatQtyDialog from "@/components/wms/FloatQtyDialog";
import NumberPickerDialog from "@/components/wms/NumberPickerDialog";
import DiscardDialog from "@/components/wms/DiscardDialog";
import { Package, Pencil, Trash2 } from "lucide-react";

interface ScannedItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  imageUrl?: string;
  assortment?: string;
  batchInfo?: string;
  setInfo?: string;
  status: "pending" | "confirmed";
  alert?: {
    type: "info" | "warn" | "error";
    message: string;
    itemOverride?: boolean;
  };
}

const demoItems: ScannedItem[] = [
  { id: "1", name: "Nike Air Max 90", sku: "SKU-NKE-AM90-BLK-42", quantity: 3, assortment: "Footwear", status: "pending" },
  { id: "2", name: "Levi's 501 Original Jeans", sku: "SKU-LVS-501-BLU-32", quantity: 5, assortment: "Denim", status: "pending",
    alert: { type: "warn", message: "Item assortment as defined in the master is incorrect.", itemOverride: true } },
  { id: "3", name: "Ray-Ban Aviator Classic", sku: "SKU-RBN-AVC-GLD-58", quantity: 2, assortment: "Accessories", status: "pending",
    alert: { type: "error", message: "Bin Capacity as defined in masters is exceeding." } },
  { id: "4", name: "Tommy Hilfiger Polo", sku: "SKU-TMH-PLS-RED-M", quantity: 4, assortment: "Apparel", status: "pending",
    alert: { type: "warn", message: "Stock of this Item is getting negative for this stock point.", itemOverride: true } },
];

const ItemScan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const binData = (location.state as any)?.bin || { code: "BIN-A12-03", availableCapacity: 50, assortment: "Footwear" };

  const [items, setItems] = useState<ScannedItem[]>(demoItems);
  const [scanMode, setScanMode] = useState<ScanMode>("icode");
  const [scanError, setScanError] = useState("");
  const [showFloatQty, setShowFloatQty] = useState(false);
  const [floatItem, setFloatItem] = useState({ name: "", code: "" });
  const [showDiscardItems, setShowDiscardItems] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [viewfinderOpen, setViewfinderOpen] = useState(false);
  const [manualMode, setManualMode] = useState(true);
  const [editItem, setEditItem] = useState<ScannedItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ScannedItem | null>(null);

  const totalScanned = items.reduce((sum, i) => sum + i.quantity, 0);
  const hasBlockingError = items.some(i => i.alert?.type === "error");

  const handleScan = (barcode: string) => {
    setScanError("");
    setViewfinderOpen(false);

    if (barcode.toUpperCase().includes("INV")) {
      setScanError("Please scan or enter a valid item.");
      return;
    }

    if (barcode.toUpperCase().includes("FLT")) {
      setFloatItem({ name: `Float Item (${barcode})`, code: barcode });
      setShowFloatQty(true);
      return;
    }

    const existing = items.find(i => i.sku === barcode);
    if (existing) {
      setItems(prev => prev.map(i => i.sku === barcode ? { ...i, quantity: i.quantity + 1 } : i));
      return;
    }

    const newItem: ScannedItem = {
      id: String(Date.now()),
      name: scanMode === "batch" ? `Batch Item (${barcode})` : scanMode === "set" ? `Set Item (${barcode})` : `Item (${barcode})`,
      sku: barcode,
      quantity: 1,
      status: "pending",
      batchInfo: scanMode === "batch" ? `BATCH-${Math.floor(Math.random() * 10000)}` : undefined,
      setInfo: scanMode === "set" ? "3 components" : undefined,
    };
    setItems(prev => [newItem, ...prev]);
  };

  const handleFloatConfirm = (qty: number) => {
    const newItem: ScannedItem = {
      id: String(Date.now()),
      name: floatItem.name,
      sku: floatItem.code,
      quantity: qty,
      status: "pending",
    };
    setItems(prev => [newItem, ...prev]);
    setShowFloatQty(false);
  };

  const handleEditConfirm = (qty: number) => {
    if (editItem) {
      setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, quantity: qty } : i));
      setEditItem(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteItem) {
      setItems(prev => prev.filter(i => i.id !== deleteItem.id));
      setDeleteItem(null);
    }
  };

  const handleBack = () => {
    if (items.length > 0) {
      setShowDiscardItems(true);
    } else {
      navigate("/bin-scan");
    }
  };

  const handleConfirmSave = () => {
    setShowSaveConfirm(false);
    navigate("/putaway-success", { state: { docNumber: `PA-${Date.now().toString().slice(-6)}`, itemCount: items.length } });
  };

  const scanPlaceholder = scanMode === "icode" ? "No item scanned yet" : scanMode === "batch" ? "Scan batch / serial barcode…" : "Scan set item barcode…";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader title="Item Scan in Manual Mode" showHome onBack={handleBack} />
      <SubHeader />

      {/* Info Strip */}
      <div className="flex items-center justify-between border-b bg-card/60 px-4 py-2.5">
        <span className="text-card-code text-muted-foreground">Bin: <span className="font-mono font-semibold text-card-foreground">{binData.code}</span></span>
        <span className="text-card-code text-muted-foreground">Avl. Cap: <span className="font-semibold text-card-foreground">{binData.availableCapacity === -1 ? "∞" : binData.availableCapacity - totalScanned}</span></span>
        <span className="text-card-code text-muted-foreground">Scanned <span className="font-bold text-primary bg-primary/10 rounded-pill px-1.5 py-0.5">{totalScanned}</span></span>
      </div>

      <ScanModeTabs activeMode={scanMode} onModeChange={setScanMode} />

      {/* Scan Card */}
      <div className="border-b bg-card p-4">
        <p className="text-badge font-bold text-primary uppercase tracking-wide mb-2">Scan Item</p>
        {manualMode ? (
          <>
            <ScanInput
              placeholder={scanPlaceholder}
              onScan={handleScan}
              onScanIconTap={() => { setManualMode(false); setViewfinderOpen(true); }}
            />
            {scanError && (
              <div className="mt-2 animate-card-enter">
                <InlineAlert type="error" message={scanError} onDismiss={() => setScanError("")} />
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => setViewfinderOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-3.5 text-left hover:border-primary/50 transition-all"
          >
            <span className="text-card-name text-muted-foreground">{scanPlaceholder}</span>
          </button>
        )}
      </div>

      {/* Active mode indicator */}
      <div className="bg-muted/50 px-4 py-1.5">
        <p className="text-badge text-muted-foreground">
          Mode: <span className="font-semibold text-primary">{scanMode === "icode" ? "ICODE / Barcode" : scanMode === "batch" ? "Batch / Serial" : "Set Items"}</span>
          {" · "}{items.length} item{items.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Item List */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center animate-fade-in">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/60">
              <Package className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <p className="text-card-name text-muted-foreground">Scan item using scanning device</p>
          </div>
        ) : (
          items.map((item, i) => (
            <div key={item.id} className="animate-card-enter rounded-2xl border bg-card shadow-card" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex gap-3 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/60">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-xl object-cover" />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground/60" />
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-0.5">
                  <p className="text-card-name text-card-foreground font-medium">{item.name}</p>
                  <p className="font-mono text-card-code text-muted-foreground">{item.sku}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.assortment && (
                      <span className="inline-flex items-center rounded-pill bg-secondary px-2 py-0.5 text-badge text-secondary-foreground">
                        {item.assortment}
                      </span>
                    )}
                    {item.batchInfo && (
                      <span className="inline-flex items-center rounded-pill bg-info/10 px-2 py-0.5 text-badge text-info">
                        Batch: {item.batchInfo}
                      </span>
                    )}
                    {item.setInfo && (
                      <span className="inline-flex items-center rounded-pill bg-accent/10 px-2 py-0.5 text-badge text-accent">
                        Set: {item.setInfo}
                      </span>
                    )}
                  </div>
                </div>

                <span className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl bg-primary px-2.5 text-badge font-bold text-primary-foreground self-start shadow-xs">
                  {item.quantity}
                </span>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between border-t px-4 py-2.5">
                <span className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-badge ${
                  item.status === "confirmed" ? "bg-success/10 text-success" : "bg-muted/60 text-muted-foreground"
                }`}>
                  {item.status === "pending" ? "Pending" : "Confirmed"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditItem(item)}
                    className="flex h-10 w-10 min-h-0 min-w-0 items-center justify-center rounded-full bg-warn/15 text-warn hover:bg-warn/25 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteItem(item)}
                    className="flex h-10 w-10 min-h-0 min-w-0 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {item.alert && (
                <div className="border-t px-4 py-3">
                  <InlineAlert
                    type={item.alert.type}
                    message={item.alert.message}
                    itemOverride={item.alert.itemOverride}
                    onProceed={item.alert.type === "warn" ? () => setItems(prev => prev.map(i => i.id === item.id ? { ...i, alert: undefined } : i)) : undefined}
                    onDismiss={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, alert: undefined } : i))}
                    dismissable={item.alert.type !== "error"}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* SAVE button */}
      <div className="sticky bottom-0 border-t bg-card/90 backdrop-blur-sm p-4">
        <button
          onClick={() => setShowSaveConfirm(true)}
          disabled={items.length === 0 || hasBlockingError}
          className="w-full rounded-xl bg-primary py-4 text-section font-bold uppercase text-primary-foreground shadow-card active:bg-primary-dark active:shadow-xs disabled:opacity-40 transition-all min-h-[56px]"
        >
          SAVE
        </button>
      </div>

      <ScanViewfinder
        open={viewfinderOpen}
        scanLabel={`SCANNING ${scanMode === "icode" ? "ITEM" : scanMode === "batch" ? "BATCH" : "SET"}...`}
        onClose={() => setViewfinderOpen(false)}
        onScan={handleScan}
        onSwitchToManual={() => { setViewfinderOpen(false); setManualMode(true); }}
      />

      <FloatQtyDialog open={showFloatQty} itemName={floatItem.name} itemCode={floatItem.code} onConfirm={handleFloatConfirm} onCancel={() => setShowFloatQty(false)} />

      <NumberPickerDialog
        open={!!editItem}
        title="Update Item Qty."
        itemName={editItem?.name}
        itemCode={editItem?.sku}
        initialValue={editItem?.quantity || 1}
        onConfirm={handleEditConfirm}
        onCancel={() => setEditItem(null)}
      />

      <DiscardDialog
        open={!!deleteItem}
        message={`Are you sure want to delete below item?\nItem No. ${deleteItem?.sku}\nQty. ${deleteItem?.quantity}`}
        cancelLabel="CANCEL"
        confirmLabel="DELETE"
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleDeleteConfirm}
      />

      <DiscardDialog
        open={showDiscardItems}
        message={items.length > 0 ? "Are you sure you want to delete all scanned item(s)?" : "Are you sure you want to discard the scanned bin configuration?"}
        cancelLabel="CANCEL"
        confirmLabel="CONFIRM"
        onCancel={() => setShowDiscardItems(false)}
        onConfirm={() => { setShowDiscardItems(false); navigate("/bin-scan"); }}
      />

      <DiscardDialog
        open={showSaveConfirm}
        message="Are you sure you want to create put away for the scanned item(s)?"
        cancelLabel="CANCEL"
        confirmLabel="CONFIRM"
        destructive={false}
        onCancel={() => setShowSaveConfirm(false)}
        onConfirm={handleConfirmSave}
      />
    </div>
  );
};

export default ItemScan;
