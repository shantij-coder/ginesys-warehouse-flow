interface DiscardDialogProps {
  open: boolean;
  message: string;
  cancelLabel?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DiscardDialog = ({ open, message, cancelLabel = "CANCEL", confirmLabel = "CONFIRM", destructive = true, onCancel, onConfirm }: DiscardDialogProps) => {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed inset-x-6 top-1/2 z-50 -translate-y-1/2 animate-float-in rounded-2xl bg-card p-6 shadow-dialog">
        <p className="text-card-name text-card-foreground mb-6 whitespace-pre-line leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-card-name font-semibold text-muted-foreground hover:bg-muted active:bg-muted/80 transition-colors min-h-[44px]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-card-name font-semibold transition-colors min-h-[44px] ${
              destructive
                ? "bg-destructive/10 text-destructive hover:bg-destructive/15"
                : "bg-primary/10 text-primary hover:bg-primary/15"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
};

export default DiscardDialog;
