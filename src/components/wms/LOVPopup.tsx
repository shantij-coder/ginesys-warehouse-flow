import { useState } from "react";
import { Check, Search, X } from "lucide-react";

export interface LOVItem {
  id: string;
  label: string;
  subLabel?: string;
}

interface LOVPopupProps {
  open: boolean;
  title: string;
  items: LOVItem[];
  selectedId?: string | null;
  allowNull?: boolean;
  nullLabel?: string;
  onSelect: (item: LOVItem | null) => void;
  onClose: () => void;
}

const LOVPopup = ({ open, title, items, selectedId, allowNull = true, nullLabel, onSelect, onClose }: LOVPopupProps) => {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = items.filter(
    (i) =>
      i.label.toLowerCase().includes(search.toLowerCase()) ||
      (i.subLabel && i.subLabel.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] animate-slide-up rounded-t-3xl bg-card shadow-elevated flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <h3 className="text-section text-card-foreground">{title}</h3>
          <button onClick={onClose} className="min-h-0 min-w-0 flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="border-t border-b px-5 py-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3.5 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              autoFocus
              className="w-full bg-transparent text-card-code text-card-foreground placeholder:text-muted-foreground/50 outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-2">
          {allowNull && (
            <button
              onClick={() => { onSelect(null); onClose(); }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-card-name text-muted-foreground hover:bg-muted/50 transition-colors min-h-[52px] mx-0"
            >
              <span className="italic">{nullLabel || `Select ${title.replace("Select ", "")}`}</span>
              {!selectedId && <Check className="h-4 w-4 text-primary" />}
            </button>
          )}
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => { onSelect(item); onClose(); }}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 hover:bg-primary/5 transition-colors min-h-[52px] ${
                selectedId === item.id ? "bg-primary/5" : ""
              }`}
            >
              <div>
                <p className="text-card-name text-card-foreground text-left">{item.label}</p>
                {item.subLabel && <p className="text-badge text-muted-foreground text-left mt-0.5">{item.subLabel}</p>}
              </div>
              {selectedId === item.id && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-10 text-center text-card-code text-muted-foreground">No results found.</p>
          )}
        </div>

        {/* Close button */}
        <div className="border-t px-5 py-3 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-card-name font-semibold text-primary hover:bg-primary/5 transition-colors min-h-[44px]">
            CLOSE
          </button>
        </div>
      </div>
    </>
  );
};

export default LOVPopup;
