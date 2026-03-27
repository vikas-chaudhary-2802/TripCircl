import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Mail, Lock, Eye, EyeOff, ArrowRight, User as UserIcon, Sparkles, Shield, Brain, Wallet, MessageCircle, ExternalLink, Compass, Star, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import tripcirclLogo from "@/assets/tripcircl-logo.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const WHATSAPP_COMMUNITY_LINK = "https://chat.whatsapp.com/LTkzdemDEg8AJCrXlyu4G6?mode=gi_t";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCommunityDialog, setShowCommunityDialog] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate("/ai-planner");
  }, [user, navigate]);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    if (form.password.length < 6) {
      toast({ title: "Password too short", description: "Must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast({ title: "Account created! 🎉", description: "Please log in to start exploring." });
      // We don't auto-login yet to keep it simple, but we show the community dialog
      setShowCommunityDialog(true);
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.response?.data?.message || error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const passwordStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabels = ["", "Weak", "Good", "Strong"];
  const strengthColors = ["", "bg-destructive", "bg-amber-500", "bg-emerald-500"];
  const strengthTextColors = ["", "text-destructive", "text-amber-500", "text-emerald-500"];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Premium Brand */}
      <div className="hidden flex-1 items-center justify-center lg:flex relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 via-primary to-accent/70" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse at 70% 20%, hsl(263 83% 68% / 0.4), transparent 60%)",
              "radial-gradient(ellipse at 30% 80%, hsl(217 91% 70% / 0.3), transparent 60%)",
              "radial-gradient(ellipse at 70% 20%, hsl(263 83% 68% / 0.4), transparent 60%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />

        <div className="relative z-10 max-w-lg px-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
            <h2 className="mb-5 text-5xl font-bold text-white leading-[1.1]">
              Join the{" "}
              <span className="font-serif italic text-white/85">Community</span>
            </h2>
            <p className="text-base text-white/40 leading-relaxed mb-12 max-w-sm">
              Plan trips with AI, find travel partners, and explore India like never before.
            </p>

            {/* Premium feature cards */}
            <div className="space-y-3">
              {[
                { icon: Brain, text: "AI-powered itinerary planner", desc: "Hyper-detailed plans in seconds" },
                { icon: Shield, text: "Verified traveler profiles", desc: "Safe & trusted community" },
                { icon: Wallet, text: "Smart expense splitting", desc: "Fair costs for everyone" },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.12 }}
                  className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/5 px-5 py-4 backdrop-blur-sm"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                    <item.icon className="h-5 w-5 text-white/70" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/80">{item.text}</p>
                    <p className="text-[11px] text-white/35">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-10 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {[
                  "bg-gradient-to-br from-violet-400 to-purple-500",
                  "bg-gradient-to-br from-blue-400 to-cyan-500",
                  "bg-gradient-to-br from-amber-400 to-orange-500",
                  "bg-gradient-to-br from-rose-400 to-pink-500",
                ].map((bg, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full ${bg} border-2 border-white/10 shadow-sm`} />
                ))}
              </div>
              <div>
                <p className="text-[12px] font-semibold text-white/60">Trusted by 10,000+ travelers</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3 w-3 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="ml-1 text-[10px] text-white/40">4.9/5</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16 relative">
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

          <div className="mb-10">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl leading-[1.1]">
              Create your <span className="font-serif italic text-gradient">account</span>
            </h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed">
              Start planning group trips and find travel partners.
            </p>
          </div>



          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="mb-2.5 block text-[13px] font-semibold text-foreground/80 uppercase tracking-[0.05em]">Full name</label>
              <div className="relative">
                <UserIcon className={`absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors duration-300 ${
                  focusedField === "name" ? "text-secondary" : "text-muted-foreground/40"
                }`} />
                <Input
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className="rounded-xl border-border/50 bg-muted/20 pl-12 text-sm placeholder:text-muted-foreground/35 focus:bg-background transition-all duration-300"
                  style={{ height: "52px" }}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-2.5 block text-[13px] font-semibold text-foreground/80 uppercase tracking-[0.05em]">Email</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors duration-300 ${
                  focusedField === "email" ? "text-secondary" : "text-muted-foreground/40"
                }`} />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="rounded-xl border-border/50 bg-muted/20 pl-12 text-sm placeholder:text-muted-foreground/35 focus:bg-background transition-all duration-300"
                  style={{ height: "52px" }}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-2.5 block text-[13px] font-semibold text-foreground/80 uppercase tracking-[0.05em]">Password</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors duration-300 ${
                  focusedField === "password" ? "text-secondary" : "text-muted-foreground/40"
                }`} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="rounded-xl border-border/50 bg-muted/20 pl-12 pr-12 text-sm placeholder:text-muted-foreground/35 focus:bg-background transition-all duration-300"
                  style={{ height: "52px" }}
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/35 hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
              {/* Password strength */}
              {form.password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 flex items-center gap-2.5"
                >
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          level <= passwordStrength ? strengthColors[passwordStrength] : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${strengthTextColors[passwordStrength]}`}>
                    {strengthLabels[passwordStrength]}
                  </span>
                </motion.div>
              )}
            </div>

            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.995 }}>
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full h-[52px] rounded-xl bg-gradient-to-r from-secondary via-accent to-secondary border-0 text-primary-foreground shadow-xl shadow-secondary/25 hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-500 text-sm font-bold tracking-wide"
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          <p className="mt-5 text-center text-[11px] text-muted-foreground/40 leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-secondary hover:text-secondary/70 transition-colors underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* WhatsApp Community Dialog */}
      <Dialog open={showCommunityDialog} onOpenChange={setShowCommunityDialog}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Welcome to TripCircl! 🎉</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Your account has been created. Join our WhatsApp community to connect with fellow travelers!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/30"
            >
              <MessageCircle className="h-8 w-8 text-white" />
            </motion.div>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Get travel tips, find trip buddies, and stay updated on new features.
            </p>
            <a href={WHATSAPP_COMMUNITY_LINK} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold gap-2">
                <MessageCircle className="h-4 w-4" /> Join WhatsApp Community <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
            <button
              onClick={() => { setShowCommunityDialog(false); navigate("/login"); }}
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Skip for now →
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Signup;
