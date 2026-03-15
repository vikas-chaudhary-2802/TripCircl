import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, MapPin, Users, Star, Shield, Compass, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import tripcirclLogo from "@/assets/tripcircl-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back! 👋", description: "You've successfully logged in." });
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: "32px 32px"
        }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[440px]"
        >
          {/* Logo */}
          <Link to="/" className="mb-12 inline-flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-secondary/20"
            >
              <img src={tripcirclLogo} alt="TripCircl" className="h-11 w-11 object-contain" />
            </motion.div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Trip<span className="text-secondary">Circl</span>
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl leading-[1.1]">
              Welcome <span className="font-serif italic text-gradient">back</span>
            </h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed">
              Sign in to continue planning your next adventure.
            </p>
          </div>

          {/* Google OAuth */}
          <motion.button
            whileHover={{ y: -2, boxShadow: "0 8px 25px -8px rgba(0,0,0,0.12)" }}
            whileTap={{ scale: 0.995 }}
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mb-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-muted/30 hover:border-border/80"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </motion.button>

          {/* Divider */}
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-[0.2em]">or</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2.5 block text-[13px] font-semibold text-foreground/80 uppercase tracking-[0.05em]">Email</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors duration-300 ${
                  focusedField === "email" ? "text-secondary" : "text-muted-foreground/40"
                }`} />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="h-13 rounded-xl border-border/50 bg-muted/20 pl-12 text-sm placeholder:text-muted-foreground/35 focus:bg-background transition-all duration-300"
                  style={{ height: "52px" }}
                  required
                />
              </div>
            </div>
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <label className="text-[13px] font-semibold text-foreground/80 uppercase tracking-[0.05em]">Password</label>
                <button type="button" className="text-[12px] font-semibold text-secondary hover:text-secondary/70 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors duration-300 ${
                  focusedField === "password" ? "text-secondary" : "text-muted-foreground/40"
                }`} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="h-13 rounded-xl border-border/50 bg-muted/20 pl-12 pr-12 text-sm placeholder:text-muted-foreground/35 focus:bg-background transition-all duration-300"
                  style={{ height: "52px" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/35 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.995 }}>
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full h-[52px] rounded-xl bg-gradient-to-r from-primary via-secondary to-accent border-0 text-primary-foreground shadow-xl shadow-secondary/25 hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-500 text-sm font-bold tracking-wide"
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-secondary hover:text-secondary/70 transition-colors underline-offset-4 hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Premium Brand */}
      <div className="hidden flex-1 items-center justify-center lg:flex relative overflow-hidden">
        {/* Multi-layer gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-secondary/80" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse at 20% 20%, hsl(263 83% 58% / 0.4), transparent 60%)",
              "radial-gradient(ellipse at 80% 80%, hsl(217 91% 60% / 0.3), transparent 60%)",
              "radial-gradient(ellipse at 20% 20%, hsl(263 83% 58% / 0.4), transparent 60%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }} />
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />

        <div className="relative z-10 max-w-lg px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            {/* Trust badges */}
            <div className="mb-10 flex flex-wrap gap-3">
              {[
                { icon: MapPin, text: "120+ Destinations", delay: 0.4 },
                { icon: Users, text: "50K+ Travelers", delay: 0.5 },
                { icon: Star, text: "4.9 Rating", delay: 0.6 },
              ].map((item) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md"
                >
                  <item.icon className="h-3.5 w-3.5 text-white/50" />
                  <span className="text-[12px] font-semibold text-white/65 tracking-wide">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Main heading */}
            <h2 className="mb-5 text-5xl font-bold text-white leading-[1.1]">
              Start Your{" "}
              <span className="font-serif italic text-white/85">Journey</span>
            </h2>
            <p className="text-base text-white/40 leading-relaxed max-w-sm">
              Join India's most trusted group travel community. Plan smarter, travel together, make memories for life.
            </p>

            {/* Feature highlights */}
            <div className="mt-10 space-y-4">
              {[
                { icon: Shield, text: "Verified & trusted community" },
                { icon: Compass, text: "AI-powered smart itineraries" },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/8 backdrop-blur-sm border border-white/5">
                    <item.icon className="h-4 w-4 text-white/50" />
                  </div>
                  <span className="text-sm font-medium text-white/50">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
