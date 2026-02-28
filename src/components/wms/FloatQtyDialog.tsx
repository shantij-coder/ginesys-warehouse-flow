import { useState } from "react";
import { X } from "lucide-react";

interface FloatQtyDialogProps {
  open: boolean;
  itemName: string;
  itemCode: string;
  onConfirm: (qty: number) => void;
  onCancel: () => void;
}

const FloatQtyDialog = ({ open, itemName, itemCode, onConfirm, onCancel }: FloatQtyDialogProps) => {
  const [qty, setQty] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    const val = parseFloat(qty);
    if (isNaN(val) || val <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }
    onConfirm(val);
    setQty("");
    setError("");
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed inset-x-5 top-1/2 z-50 -translate-y-1/2 animate-float-in rounded-2xl bg-card p-6 shadow-dialog">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-section text-card-foreground">Enter Quantity</h3>
          <button onClick={onCancel} className="min-h-0 min-w-0 flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 rounded-xl bg-muted/60 p-3.5">
          <p className="text-card-name text-card-foreground">{itemName}</p>
          <p className="font-mono text-card-code text-muted-foreground mt-0.5">{itemCode}</p>
        </div>

        <input
          type="number"
          step="0.01"
          value={qty}
          onChange={(e) => { setQty(e.target.value); setError(""); }}
          placeholder="0.00"
          autoFocus
          className="w-full rounded-xl border-2 border-input bg-card px-4 py-3.5 text-title text-card-foreground text-center placeholder:text-muted-foreground/40 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
        />

        {error && <p className="mt-2 text-alert text-destructive">{error}</p>}

        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border py-3 text-card-name font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!qty}
            className="flex-1 rounded-xl bg-primary py-3 text-card-name font-semibold text-primary-foreground shadow-card active:bg-primary-dark disabled:opacity-40 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </>
  );
};

export default FloatQtyDialog;
