import { AlertTriangle, XCircle, Info, CheckCircle, X, Star } from "lucide-react";

type AlertType = "info" | "success" | "warn" | "error";

interface InlineAlertProps {
  type: AlertType;
  message: string;
  itemOverride?: boolean;
  onDismiss?: () => void;
  onProceed?: () => void;
  dismissable?: boolean;
}

const alertStyles: Record<AlertType, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  info: {
    bg: "bg-info/8",
    border: "border-info/20",
    text: "text-info",
    icon: <Info className="h-4.5 w-4.5" />,
  },
  success: {
    bg: "bg-success/8",
    border: "border-success/20",
    text: "text-success",
    icon: <CheckCircle className="h-4.5 w-4.5" />,
  },
  warn: {
    bg: "bg-warn/8",
    border: "border-warn/20",
    text: "text-warn",
    icon: <AlertTriangle className="h-4.5 w-4.5" />,
  },
  error: {
    bg: "bg-destructive/8",
    border: "border-destructive/20",
    text: "text-destructive",
    icon: <XCircle className="h-4.5 w-4.5" />,
  },
};

const InlineAlert = ({ type, message, itemOverride, onDismiss, onProceed, dismissable = true }: InlineAlertProps) => {
  const style = alertStyles[type];

  return (
    <div className={`animate-card-enter rounded-xl border ${style.border} ${style.bg} p-3`}>
      <div className="flex items-start gap-2.5">
        <span className={`${style.text} mt-0.5`}>{style.icon}</span>
        <div className="flex-1 space-y-2">
          {itemOverride && (
            <span className="inline-flex items-center gap-1 rounded-pill bg-warn/15 px-2 py-0.5 text-badge text-warn">
              <Star className="h-3 w-3" /> Item Override
            </span>
          )}
          <p className="text-alert text-card-foreground leading-relaxed">{message}</p>
          {onProceed && type === "warn" && (
            <button
              onClick={onProceed}
              className="mt-1 rounded-lg bg-warn/15 px-4 py-2 text-badge font-semibold text-warn hover:bg-warn/20 transition-colors"
            >
              Proceed Anyway
            </button>
          )}
        </div>
        {dismissable && type !== "error" && onDismiss && (
          <button onClick={onDismiss} className="min-h-0 min-w-0 p-1 text-muted-foreground hover:text-card-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InlineAlert;
