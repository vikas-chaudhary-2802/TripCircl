import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, MapPin, Users, Star, Shield, Compass, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import tripcirclLogo from "@/assets/tripcircl-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, login } = useAuth();
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
    try {
      await login(email, password);
      toast({ title: "Welcome back! 👋", description: "You've successfully logged in." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
