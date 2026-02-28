import { useState, useRef, useEffect } from "react";
import { ScanBarcode } from "lucide-react";

interface ScanInputProps {
  placeholder?: string;
  onScan: (value: string) => void;
  onScanIconTap?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

const ScanInput = ({ placeholder = "Scan barcode…", onScan, onScanIconTap, disabled = false, autoFocus = true }: ScanInputProps) => {
  const [value, setValue] = useState("");
  const [feedbackState, setFeedbackState] = useState<"idle" | "success" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onScan(value.trim());
    setFeedbackState("success");
    setValue("");
    setTimeout(() => setFeedbackState("idle"), 500);
  };

  const feedbackClass =
    feedbackState === "success" ? "animate-scan-success border-success ring-4 ring-success/10" :
    feedbackState === "error" ? "animate-scan-error" : "border-input focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10";

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`flex items-center gap-3 rounded-xl border-2 bg-card px-4 py-3 transition-all duration-200 ${feedbackClass} ${disabled ? "opacity-50" : ""}`}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent text-card-name text-card-foreground placeholder:text-muted-foreground/50 placeholder:italic outline-none"
        />
        {onScanIconTap ? (
          <button
            type="button"
            onClick={onScanIconTap}
            className="min-h-0 min-w-0 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/15 active:bg-primary/20 transition-colors"
          >
            <div className="relative h-5 w-5">
              <div className="absolute left-0 top-0 h-1.5 w-1.5 border-l-2 border-t-2 border-primary rounded-tl-sm" />
              <div className="absolute right-0 top-0 h-1.5 w-1.5 border-r-2 border-t-2 border-primary rounded-tr-sm" />
              <div className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b-2 border-l-2 border-primary rounded-bl-sm" />
              <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b-2 border-r-2 border-primary rounded-br-sm" />
              <div className="absolute left-1 right-1 top-1/2 h-0.5 -translate-y-1/2 bg-primary/60" />
            </div>
          </button>
        ) : (
          <ScanBarcode className="h-5 w-5 shrink-0 text-primary" />
        )}
      </div>
    </form>
  );
};

export default ScanInput;
