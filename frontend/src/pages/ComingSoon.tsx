import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Rocket, ArrowLeft, Sparkles, Bell, Globe, Map, MessageCircle, Users, Compass, ArrowRight, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { toast } from "sonner";

const featureInfo: Record<string, { title: string; description: string; icon: React.ElementType; gradient: string; emoji: string }> = {
  "/explore": {
    title: "Discover Trips",
    description: "Browse curated group trips across India, filter by destination, budget, and travel style — and join the ones that match your vibe.",
    icon: Compass,
    gradient: "from-violet-500 to-purple-600",
    emoji: "🧭",
  },
  "/create-trip": {
    title: "Create a Trip",
    description: "Design your own group adventure — set the destination, dates, budget, and invite travelers to join your crew.",
    icon: Map,
    gradient: "from-blue-500 to-cyan-500",
    emoji: "🗺️",
  },
  "/dashboard": {
    title: "My Trips",
    description: "Your personal travel dashboard — track upcoming trips, manage itineraries, and stay on top of group expenses.",
    icon: Globe,
    gradient: "from-emerald-500 to-teal-500",
    emoji: "🌍",
  },
  "/messages": {
    title: "Messages",
    description: "Real-time group chat with your travel crew — coordinate plans, share updates, and stay connected.",
    icon: MessageCircle,
    gradient: "from-orange-500 to-amber-500",
    emoji: "💬",
  },
  "/profile": {
    title: "Profile",
    description: "Your traveler identity — showcase your travel style, past trips, ratings, and connect with like-minded explorers.",
    icon: Users,
    gradient: "from-pink-500 to-rose-500",
    emoji: "👤",
  },
};

const ComingSoon = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [loading, setLoading] = useState(false);

  const path = Object.keys(featureInfo).find((key) => location.pathname.startsWith(key)) || "/explore";
  const feature = featureInfo[path] || featureInfo["/explore"];
  const Icon = feature.icon;

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      // Newsletter mock
      toast.success("You're on the priority list! 🚀 Check your inbox for confirmation.");
      setEmail("");
      setNotified(true); // Set notified to true on success
    } catch (error) {
       toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-4 pt-24 pb-12">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
        <motion.div
          className="absolute inset-0"
          animate={{ background: [
            "radial-gradient(ellipse at 30% 40%, hsl(263 83% 58% / 0.06), transparent 60%)",
            "radial-gradient(ellipse at 70% 60%, hsl(217 91% 60% / 0.06), transparent 60%)",
            "radial-gradient(ellipse at 30% 40%, hsl(263 83% 58% / 0.06), transparent 60%)",
          ]}}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="container-max relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Icon with glow */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="relative mb-10"
          >
            <div className={`relative flex h-20 w-20 items-center justify-center rounded-3xl border-2 ${
              path === "/explore" ? "border-violet-200 bg-violet-50 dark:border-violet-500/20 dark:bg-violet-500/10" :
              path === "/create-trip" ? "border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10" :
              path === "/dashboard" ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10" :
              path === "/messages" ? "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10" :
              "border-pink-200 bg-pink-50 dark:border-pink-500/20 dark:bg-pink-500/10"
            }`}>
              <Icon className={`h-9 w-9 ${
                path === "/explore" ? "text-violet-600" :
                path === "/create-trip" ? "text-blue-600" :
                path === "/dashboard" ? "text-emerald-600" :
                path === "/messages" ? "text-amber-600" :
                "text-pink-600"
              }`} strokeWidth={1.5} />
            </div>
            <motion.div
              className={`absolute inset-0 rounded-3xl ${
                path === "/explore" ? "bg-violet-400" :
                path === "/create-trip" ? "bg-blue-400" :
                path === "/dashboard" ? "bg-emerald-400" :
                path === "/messages" ? "bg-amber-400" : "bg-pink-400"
              }`}
              animate={{ opacity: [0.15, 0, 0.15] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ filter: "blur(24px)" }}
            />
            <motion.div
              animate={{ y: [-3, 3, -3], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-card border border-border shadow-lg"
            >
              <Rocket className="h-4 w-4 text-secondary" />
            </motion.div>
          </motion.div>

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/15 bg-secondary/5 px-4 py-1.5 text-xs font-semibold text-secondary uppercase tracking-wider">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="h-3.5 w-3.5" />
              </motion.div>
              Coming Soon
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl"
          >
            {feature.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-10 max-w-md text-base text-muted-foreground leading-relaxed"
          >
            {feature.description}
          </motion.p>

          {/* Email signup */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-full max-w-sm"
          >
            {notified ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-500/20 dark:bg-emerald-500/5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Star className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">You're on the priority list! Check your inbox 📬</span>
              </motion.div>
            ) : (
              <form onSubmit={handleNotify} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10 transition-all"
                  disabled={loading}
                />
                <Button 
                  type="submit" 
                  className="h-12 rounded-xl bg-gradient-to-r from-secondary to-accent border-0 text-white shadow-lg shadow-secondary/15 hover:opacity-90 px-5 font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <><Bell className="h-4 w-4 mr-1.5" /> Notify Me</>
                  )}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-border" />
            <span className="text-xs text-muted-foreground/50">or try what's live</span>
            <div className="h-px w-12 bg-border" />
          </motion.div>

          {/* AI Planner CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <Link to="/ai-planner">
              <Button variant="outline" size="lg" className="rounded-xl border-border hover:border-secondary/30 hover:bg-secondary/5 gap-2 font-semibold">
                <Zap className="h-4 w-4 text-secondary" />
                Try AI Trip Planner
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </motion.div>

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              <ArrowLeft className="h-3 w-3" /> Back to Home
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ComingSoon;
