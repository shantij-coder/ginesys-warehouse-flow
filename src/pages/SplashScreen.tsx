import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gerpIcon from "@/assets/gerp-icon.png";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary">
      <div className="animate-float-in flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-primary-foreground/10 blur-2xl" />
          <img src={gerpIcon} alt="Ginesys ERP" className="relative h-28 w-28 rounded-3xl shadow-elevated" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground">GINESYS</h1>
          <p className="mt-1.5 text-sm font-medium tracking-[0.2em] text-primary-foreground/60 uppercase">Warehouse Management</p>
        </div>
        <div className="mt-8 h-1 w-28 overflow-hidden rounded-full bg-primary-foreground/15">
          <div className="h-full animate-pulse rounded-full bg-primary-foreground/50" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
