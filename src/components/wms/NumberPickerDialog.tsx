import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";

interface NumberPickerDialogProps {
  open: boolean;
  title?: string;
  itemName?: string;
  itemCode?: string;
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onConfirm: (value: number) => void;
  onCancel: () => void;
}

const NumberPickerDialog = ({
  open,
  title = "Update Quantity",
  itemName,
  itemCode,
  initialValue = 1,
  min = 0,
  max = 10000,
  step = 1,
  onConfirm,
  onCancel,
}: NumberPickerDialogProps) => {
  const [value, setValue] = useState(initialValue);

  if (!open) return null;

  const increment = () => setValue((v) => Math.min(max, v + step));
  const decrement = () => setValue((v) => Math.max(min, v - step));

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed inset-x-5 top-1/2 z-50 -translate-y-1/2 animate-float-in rounded-2xl bg-card p-6 shadow-dialog">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-section text-card-foreground">{title}</h3>
          <button onClick={onCancel} className="min-h-0 min-w-0 flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {(itemName || itemCode) && (
          <div className="mb-5 rounded-xl bg-muted/60 p-3.5">
            {itemName && <p className="text-card-name text-card-foreground">{itemName}</p>}
            {itemCode && <p className="font-mono text-card-code text-muted-foreground mt-0.5">{itemCode}</p>}
          </div>
        )}

        {/* Number picker */}
        <div className="flex items-center justify-center gap-5 py-4">
          <button
            onClick={decrement}
            disabled={value <= min}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border text-card-foreground active:bg-muted hover:border-primary/30 disabled:opacity-25 transition-all"
          >
            <Minus className="h-5 w-5" />
          </button>
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const v = parseInt(e.target.value) || min;
              setValue(Math.max(min, Math.min(max, v)));
            }}
            className="w-24 rounded-xl border-2 border-input bg-card px-2 py-3 text-center text-title text-card-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
          />
          <button
            onClick={increment}
            disabled={value >= max}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border text-card-foreground active:bg-muted hover:border-primary/30 disabled:opacity-25 transition-all"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border py-3 text-card-name font-semibold text-muted-foreground hover:bg-muted active:bg-muted/80 transition-colors min-h-[48px]"
          >
            CANCEL
          </button>
          <button
            onClick={() => onConfirm(value)}
            className="flex-1 rounded-xl bg-primary py-3 text-card-name font-semibold text-primary-foreground shadow-card active:bg-primary-dark transition-all min-h-[48px]"
          >
            UPDATE
          </button>
        </div>
      </div>
    </>
  );
};

export default NumberPickerDialog;
