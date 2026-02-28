import { X, LayoutDashboard, Settings, LogOut, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gerpIcon from "@/assets/gerp-icon.png";

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NavigationDrawer = ({ open, onClose }: NavigationDrawerProps) => {
  const navigate = useNavigate();

  if (!open) return null;

  const handleNav = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 z-50 w-[280px] animate-slide-right bg-card shadow-elevated flex flex-col">
        {/* User Header */}
        <div className="relative overflow-hidden bg-primary px-5 pb-5 pt-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/5 to-transparent" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15 shadow-xs">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-card-name font-semibold text-primary-foreground">Raj Kumar</p>
                <p className="text-badge text-primary-foreground/60 mt-0.5">USER-RK001</p>
              </div>
            </div>
            <button onClick={onClose} className="min-h-0 min-w-0 flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground/60 hover:bg-primary-foreground/10 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 flex flex-col p-3 gap-0.5">
          <button onClick={() => handleNav("/dashboard")} className="flex items-center gap-3 rounded-xl px-4 py-3 text-card-name text-card-foreground hover:bg-primary/5 active:bg-primary/10 transition-colors">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <span className="flex-1 text-left">Dashboard</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
          </button>
          <button onClick={() => handleNav("/settings")} className="flex items-center gap-3 rounded-xl px-4 py-3 text-card-name text-card-foreground hover:bg-primary/5 active:bg-primary/10 transition-colors">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-left">Settings</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
          </button>
        </nav>

        <div className="border-t p-3">
          <button onClick={() => handleNav("/login")} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-card-name text-destructive hover:bg-destructive/5 active:bg-destructive/10 transition-colors">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
          <div className="flex items-center gap-2 px-4 py-3 mt-1">
            <img src={gerpIcon} alt="Ginesys" className="h-5 w-5 rounded" />
            <span className="text-badge text-muted-foreground/60">Ginesys WMS v2.0</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationDrawer;
