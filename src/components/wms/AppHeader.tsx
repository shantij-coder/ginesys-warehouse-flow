import { ArrowLeft, Home, Moon, Sun, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  showHome?: boolean;
  showOverflow?: boolean;
  onOverflow?: () => void;
}

const AppHeader = ({ title, onBack, showHome = false, showOverflow = false, onOverflow }: AppHeaderProps) => {
  const navigate = useNavigate();

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-primary px-4 py-3 shadow-xs">
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} className="min-h-0 min-w-0 flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground/90 hover:bg-primary-foreground/10 active:bg-primary-foreground/20 transition-all duration-150">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        {showHome && (
          <button onClick={() => navigate("/dashboard")} className="min-h-0 min-w-0 flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground/90 hover:bg-primary-foreground/10 active:bg-primary-foreground/20 transition-all duration-150">
            <Home className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-[0.9375rem] font-semibold text-primary-foreground tracking-tight ml-1">{title}</h1>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={toggleDark} className="min-h-0 min-w-0 flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground/80 hover:bg-primary-foreground/10 active:bg-primary-foreground/20 transition-all duration-150">
          <Sun className="h-[1.125rem] w-[1.125rem] hidden dark:block" />
          <Moon className="h-[1.125rem] w-[1.125rem] block dark:hidden" />
        </button>
        {showOverflow && (
          <button onClick={onOverflow} className="min-h-0 min-w-0 flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground/80 hover:bg-primary-foreground/10 active:bg-primary-foreground/20 transition-all duration-150">
            <MoreVertical className="h-[1.125rem] w-[1.125rem]" />
          </button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
