import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/wms/AppHeader";
import ProfileStatusBar from "@/components/wms/ProfileStatusBar";
import ScanInput from "@/components/wms/ScanInput";
import ItemCard, { type ItemData } from "@/components/wms/ItemCard";
import ConfirmationSheet from "@/components/wms/ConfirmationSheet";
import InlineAlert from "@/components/wms/InlineAlert";
import { Package } from "lucide-react";

// Mock data showcasing all states
const mockItems: ItemData[] = [
  {
    id: "1",
    name: "Nike Air Max 90",
    sku: "SKU-NKE-AM90-BLK-42",
    quantity: 3,
    assortment: "Footwear",
    status: "confirmed",
    binCode: "BIN-A12-03",
    binCapacity: 65,
  },
  {
    id: "2",
    name: "Levi's 501 Original Jeans",
    sku: "SKU-LVS-501-BLU-32",
    quantity: 5,
    assortment: "Denim",
    status: "pending",
    binCode: "BIN-B04-07",
    binCapacity: 82,
    alert: {
      type: "warn",
      message: "Assortment Mismatch — This bin is tagged for Sportswear. Continuing will place item outside its tagged assortment.",
    },
  },
  {
    id: "3",
    name: "Ray-Ban Aviator Classic",
    sku: "SKU-RBN-AVC-GLD-58",
    quantity: 2,
    assortment: "Accessories",
    status: "pending",
    binCode: "BIN-C01-02",
    binCapacity: 105,
    alert: {
      type: "error",
      message: "Capacity Exceeded — Cannot place item. Bin BIN-C01-02 is at 105% capacity. Please select a different bin.",
    },
  },
  {
    id: "4",
    name: "Adidas Ultraboost 22",
    sku: "SKU-ADS-UB22-WHT-44",
    quantity: 1,
    status: "pending",
  },
  {
    id: "5",
    name: "Tommy Hilfiger Polo Shirt",
    sku: "SKU-TMH-PLS-RED-M",
    quantity: 4,
    assortment: "Apparel",
    status: "pending",
    binCode: "BIN-D02-05",
    binCapacity: 45,
    alert: {
      type: "warn",
      message: "Negative stock possible. Proceed with care.",
      itemOverride: true,
    },
  },
  {
    id: "6",
    name: "Calvin Klein Wallet",
    sku: "SKU-CKN-WLT-BLK-OS",
    quantity: 6,
    assortment: "Leather Goods",
    status: "error",
    binCode: "BIN-E03-01",
    binCapacity: 92,
    alert: {
      type: "error",
      message: "Negative stock not permitted for this item.",
      itemOverride: true,
    },
  },
];

const PutawayOperation = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemData[]>(mockItems);
  const [showSheet, setShowSheet] = useState(false);
  const [showNetworkAlert, setShowNetworkAlert] = useState(false);

  const confirmedCount = items.filter(i => i.status === "confirmed").length;
  const hasStopError = items.some(i => i.alert?.type === "error");

  const handleItemScan = (barcode: string) => {
    const newItem: ItemData = {
      id: String(Date.now()),
      name: `Scanned Item (${barcode})`,
      sku: barcode,
      quantity: 1,
      status: "pending",
    };
    setItems(prev => [newItem, ...prev]);
  };

  const handleBinScan = (binCode: string) => {
    // Assign bin to first unassigned item
    setItems(prev =>
      prev.map((item, idx) => {
        if (!item.binCode && item.status === "pending" && idx === prev.findIndex(i => !i.binCode && i.status === "pending")) {
          return { ...item, binCode, binCapacity: Math.floor(Math.random() * 80) + 20 };
        }
        return item;
      })
    );
  };

  const handleConfirm = () => {
    setItems(prev =>
      prev.map(item =>
        item.status === "pending" && item.binCode && item.alert?.type !== "error"
          ? { ...item, status: "confirmed" as const, alert: undefined }
          : item
      )
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Zone A — Fixed Top */}
      <AppHeader title="Putaway" onBack={() => navigate("/dashboard")} />
      <ProfileStatusBar flags={{ assortmentOverride: true, capacityOverride: false, negativeStockMode: "warn" }} />

      {/* Session header */}
      <div className="border-b bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-card-code text-muted-foreground">PO-2026-001287</p>
            <p className="text-badge text-primary">{confirmedCount} of {items.length} items scanned</p>
          </div>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(confirmedCount / items.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Item Scan Input */}
      <div className="border-b bg-card p-4">
        <ScanInput placeholder="Scan item barcode…" onScan={handleItemScan} />
      </div>

      {/* Network alert demo */}
      {showNetworkAlert && (
        <div className="p-4 pb-0">
          <InlineAlert type="warn" message="No network connection — operations paused." onDismiss={() => setShowNetworkAlert(false)} />
        </div>
      )}

      {/* Zone B — Scrollable Item List */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground/40" />
            <p className="text-card-name text-muted-foreground">No items scanned yet.</p>
            <p className="text-card-code text-muted-foreground">Scan an item barcode to begin.</p>
          </div>
        ) : (
          items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onProceed={() => {
                setItems(prev => prev.map(i => i.id === item.id ? { ...i, alert: undefined } : i));
              }}
              onDismissAlert={() => {
                setItems(prev => prev.map(i => i.id === item.id ? { ...i, alert: undefined } : i));
              }}
            />
          ))
        )}
      </div>

      {/* Zone C — Fixed Bottom */}
      <div className="sticky bottom-0 border-t bg-card p-4 space-y-3">
        <ScanInput placeholder="Scan bin barcode…" onScan={handleBinScan} autoFocus={false} />
        <div className="flex gap-3">
          <button
            onClick={() => setShowSheet(true)}
            className="flex-1 rounded-lg border border-border py-4 text-section text-card-foreground active:bg-muted"
          >
            Summary
          </button>
          <button
            onClick={handleConfirm}
            disabled={hasStopError || confirmedCount === items.length}
            className="flex-1 rounded-lg bg-primary py-4 text-section text-primary-foreground active:bg-primary-dark disabled:opacity-40"
          >
            Confirm Putaway
          </button>
        </div>
      </div>

      {/* Confirmation Sheet */}
      <ConfirmationSheet
        items={items}
        open={showSheet}
        onClose={() => setShowSheet(false)}
        onEndSession={() => {
          setShowSheet(false);
          navigate("/dashboard");
        }}
      />
    </div>
  );
};

export default PutawayOperation;
