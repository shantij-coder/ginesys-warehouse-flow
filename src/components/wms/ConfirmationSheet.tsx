import { CheckCircle, X, Package } from "lucide-react";
import type { ItemData } from "./ItemCard";

interface ConfirmationSheetProps {
  items: ItemData[];
  onClose: () => void;
  onEndSession: () => void;
  open: boolean;
}

const ConfirmationSheet = ({ items, onClose, onEndSession, open }: ConfirmationSheetProps) => {
  if (!open) return null;

  const confirmed = items.filter(i => i.status === "confirmed");

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up rounded-t-3xl bg-card shadow-elevated">
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/20" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3">
          <h2 className="text-section text-card-foreground">Session Summary</h2>
          <button onClick={onClose} className="min-h-0 min-w-0 flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-t px-5 py-4 space-y-3 max-h-[50vh] overflow-y-auto">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="text-card-name text-card-foreground">{confirmed.length} items confirmed</span>
          </div>

          {confirmed.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3.5">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-card-name text-card-foreground">{item.name}</p>
                <p className="font-mono text-card-code text-muted-foreground">{item.sku} → {item.binCode}</p>
              </div>
              <span className="text-badge font-bold text-success">×{item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t p-5">
          <button
            onClick={onEndSession}
            className="w-full rounded-xl bg-primary py-4 text-section font-semibold text-primary-foreground shadow-card active:bg-primary-dark transition-all"
          >
            End Session
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmationSheet;
