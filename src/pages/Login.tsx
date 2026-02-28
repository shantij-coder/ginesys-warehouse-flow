import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import gerpIcon from "@/assets/gerp-icon.png";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8 animate-float-in">
        {/* Branding */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-primary/10 blur-xl" />
            <img src={gerpIcon} alt="Ginesys ERP" className="relative h-20 w-20 rounded-2xl shadow-elevated" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">GINESYS WMS</h1>
            <p className="text-card-code text-muted-foreground mt-1">Warehouse Management System</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-badge font-semibold text-muted-foreground uppercase tracking-wide">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoFocus
              disabled={loading}
              className="w-full rounded-xl border-2 border-input bg-card px-4 py-3.5 text-card-name text-card-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-badge font-semibold text-muted-foreground uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loading}
                className="w-full rounded-xl border-2 border-input bg-card px-4 py-3.5 pr-12 text-card-name text-card-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 min-h-0 min-w-0 p-2 text-muted-foreground hover:text-card-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="animate-card-enter text-alert text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={!username.trim() || !password.trim() || loading}
            className="w-full rounded-xl bg-primary py-4 text-section font-semibold text-primary-foreground shadow-card active:bg-primary-dark active:shadow-xs disabled:opacity-40 flex items-center justify-center gap-2 transition-all duration-200"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="text-center text-badge text-muted-foreground/50">v2.0 • Ginesys ERP</p>
      </div>
    </div>
  );
};

export default Login;
