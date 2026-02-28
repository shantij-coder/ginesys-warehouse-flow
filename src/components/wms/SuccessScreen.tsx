import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import gerpIcon from "@/assets/gerp-icon.png";

interface SuccessScreenProps {
  message: string;
  docNumber: string;
  details?: string;
  dashboardPath?: string;
  continuePath?: string;
  continueLabel?: string;
}

const SuccessScreen = ({
  message,
  docNumber,
  details,
  dashboardPath = "/dashboard",
  continuePath,
  continueLabel = "CONTINUE",
}: SuccessScreenProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Success Icon */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-success/15 blur-xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success/10 animate-success-bounce">
              <CheckCircle className="h-14 w-14 text-success" />
            </div>
          </div>
          <h1 className="text-title text-card-foreground animate-float-in">{message}</h1>
          <div className="animate-float-in" style={{ animationDelay: "100ms" }}>
            <p className="font-mono text-section text-primary bg-primary/5 rounded-xl px-4 py-2 inline-block">{docNumber}</p>
          </div>
        </div>

        {/* Details */}
        {details && (
          <div className="rounded-2xl border bg-card p-4 shadow-card animate-float-in" style={{ animationDelay: "200ms" }}>
            <p className="text-card-code text-muted-foreground">{details}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 animate-float-in" style={{ animationDelay: "300ms" }}>
          <button
            onClick={() => navigate(dashboardPath)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-4 text-card-name font-semibold text-primary shadow-card hover:shadow-card-hover active:bg-muted transition-all min-h-[56px]"
          >
            DASHBOARD
          </button>
          {continuePath && (
            <button
              onClick={() => navigate(continuePath)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-4 text-card-name font-semibold text-primary-foreground shadow-card active:bg-primary-dark transition-all min-h-[56px]"
            >
              {continueLabel}
            </button>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <img src={gerpIcon} alt="Ginesys" className="h-5 w-5 rounded" />
          <span className="text-badge text-muted-foreground/50">Ginesys WMS</span>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
