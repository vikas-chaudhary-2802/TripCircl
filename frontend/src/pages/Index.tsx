import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, MapPin, Calendar, Shield, Star, ArrowRight, Globe, MessageCircle, Wallet, Compass, Sparkles, Mountain, Camera, Zap, Heart, ChevronRight, Map, Brain, Clock, Search, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-travel.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

/* ─── Micro-stories that rotate ─── */
const microStories = [
  "Priya went solo to Spiti. Came back with 6 new friends.",
  "Arjun planned 5 days in Goa in 14 seconds with AI.",
  "Neha's group split ₹45,000 across 6 people — effortlessly.",
  "Rohan discovered a hidden waterfall in Meghalaya no guide knew about.",
  "Ananya's Kerala houseboat plan was better than any travel agent's.",
];

/* ─── Destination suggestions for the hero search ─── */
const HERO_SUGGESTIONS = [
  { name: "Goa", emoji: "🏖️", tag: "Beaches & nightlife" },
  { name: "Jaipur", emoji: "🏰", tag: "Heritage & culture" },
  { name: "Kerala", emoji: "🌴", tag: "Backwaters & nature" },
  { name: "Manali", emoji: "🏔️", tag: "Mountains & adventure" },
  { name: "Rishikesh", emoji: "🧘", tag: "Spirituality & yoga" },
  { name: "Udaipur", emoji: "🏯", tag: "Romance & lakes" },
  { name: "Bali", emoji: "🌺", tag: "Tropical paradise" },
  { name: "Ladakh", emoji: "⛰️", tag: "Raw & remote" },
];

const SURPRISE_DESTINATIONS = [
  "Hampi", "Spiti Valley", "Pondicherry", "Coorg", "Meghalaya",
  "Andaman Islands", "Pushkar", "Alleppey", "Darjeeling", "Rann of Kutch",
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Planning",
    description: "Get hyper-detailed itineraries with hidden gems, local food spots, and cost breakdowns — in seconds.",
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    border: "border-violet-200/60 dark:border-violet-500/20",
  },
  {
    icon: Users,
    title: "Smart Matching",
    description: "Our algorithm pairs you with travelers who match your vibe, budget, and travel dates.",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200/60 dark:border-blue-500/20",
  },
  {
    icon: MessageCircle,
    title: "Live Coordination",
    description: "Built-in group chat, shared itineraries, and real-time updates keep everyone aligned.",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200/60 dark:border-emerald-500/20",
  },
  {
    icon: Shield,
    title: "Verified Community",
    description: "Every profile is verified. Ratings and reviews ensure you travel with people you can trust.",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200/60 dark:border-amber-500/20",
  },
];

const steps = [
  { number: "01", title: "Tell Us Your Dream", description: "Pick where you want to go or let AI suggest the perfect spot based on your mood.", icon: Compass, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-500/10", border: "border-violet-200/60 dark:border-violet-500/20" },
  { number: "02", title: "Set Your Vibe", description: "Choose your pace, budget, and travel style. One tap at a time — like a conversation.", icon: Heart, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200/60 dark:border-blue-500/20" },
  { number: "03", title: "AI Crafts Your Plan", description: "Get a detailed, day-by-day itinerary with hidden gems, food spots, and cost estimates.", icon: Brain, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200/60 dark:border-emerald-500/20" },
  { number: "04", title: "Refine & Go", description: "Modify any part of your plan with a simple chat message. Then hit the road.", icon: Zap, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200/60 dark:border-amber-500/20" },
];

const testimonials = [
  {
    quote: "TripCircl changed how I travel. Found an amazing group for Ladakh — we're planning our third trip together now!",
    author: "Priya S.",
    role: "Solo Explorer",
    location: "Mumbai",
    rating: 5,
    avatar: "PS",
    gradient: "from-violet-500 to-purple-600",
    color: "text-violet-600",
  },
  {
    quote: "The AI planner gave me a Rajasthan itinerary better than any travel agent ever did. Every restaurant recommendation was spot on.",
    author: "Arjun M.",
    role: "Weekend Traveler",
    location: "Bangalore",
    rating: 5,
    avatar: "AM",
    gradient: "from-blue-500 to-cyan-500",
    color: "text-blue-600",
  },
  {
    quote: "Expense splitting alone saved us hours of arguments. Plus the group matching is genuinely thoughtful.",
    author: "Neha R.",
    role: "Adventure Lover",
    location: "Delhi",
    rating: 5,
    avatar: "NR",
    gradient: "from-emerald-500 to-teal-500",
    color: "text-emerald-600",
  },
];

const destinations = [
  { name: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=500&fit=crop", trips: "24 trips", tag: "Beaches" },
  { name: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=500&fit=crop", trips: "18 trips", tag: "Heritage" },
  { name: "Kerala", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=500&fit=crop", trips: "31 trips", tag: "Backwaters" },
  { name: "Ladakh", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=500&fit=crop", trips: "12 trips", tag: "Mountains" },
];

/* ─── Rotating Micro-Story Component ─── */
const MicroStory = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIdx((p) => (p + 1) % microStories.length), 4000);
    return () => clearInterval(timer);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={idx}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4 }}
        className="text-sm text-white/50 italic"
      >
        "{microStories[idx]}"
      </motion.p>
    </AnimatePresence>
  );
};

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [heroInput, setHeroInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = HERO_SUGGESTIONS.filter((s) =>
    s.name.toLowerCase().includes(heroInput.toLowerCase())
  );

  const handleHeroSearch = (destination?: string) => {
    const dest = destination || heroInput;
    if (dest) {
      navigate(`/ai-planner?destination=${encodeURIComponent(dest)}`);
    } else {
      navigate("/ai-planner");
    }
  };

  const handleSurpriseMe = () => {
    const random = SURPRISE_DESTINATIONS[Math.floor(Math.random() * SURPRISE_DESTINATIONS.length)];
    navigate(`/ai-planner?destination=${encodeURIComponent(random)}&surprise=true`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Premium Hero ─── */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 origin-center" style={{ scale: heroScale }}>
          <motion.div
            className="h-full w-full"
            animate={{ scale: [1, 1.15, 1], filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={heroImage} alt="Travelers exploring mountains at golden hour" className="h-full w-full object-cover" />
          </motion.div>
        </motion.div>
        
        {/* Layered gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

        {/* Floating magical orbs/particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => {
            const size = Math.random() * 6 + 3;
            return (
              <motion.div
                key={`orb-${i}`}
                className="absolute rounded-full bg-white shadow-[0_0_15px_3px_rgba(255,255,255,0.4)] blur-[1px]"
                style={{
                  width: size,
                  height: size,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -Math.random() * 150 - 50],
                  x: [0, Math.random() * 60 - 30],
                  opacity: [0, Math.random() * 0.6 + 0.2, 0],
                  scale: [0.5, 1.5, 0.5]
                }}
                transition={{
                  duration: Math.random() * 8 + 8,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="container-max relative z-10 px-4 pt-20 text-center">
          {/* Subtle badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-medium text-white/70 backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              AI-Powered Travel Planning
            </span>
          </motion.div>

          {/* Main heading — clean serif + sans combo */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-4 text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-[5.5rem]"
          >
            Where will you go
            <br />
            <span className="font-serif italic bg-gradient-to-r from-violet-300 via-purple-200 to-blue-300 bg-clip-text text-transparent">next?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mb-10 max-w-md text-base text-white/50 leading-relaxed"
          >
            Your personal AI travel assistant. Tell us where you dream of going — we'll craft the perfect plan.
          </motion.p>

          {/* ─── Single-Question Hero Input ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mx-auto max-w-xl"
          >
            <div className="relative">
              <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-2xl shadow-2xl shadow-black/30 transition-all duration-300 focus-within:border-violet-400/50 focus-within:bg-white/15 focus-within:shadow-violet-500/10">
                <Search className="h-5 w-5 text-white/40 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Where do you dream of going?"
                  value={heroInput}
                  onChange={(e) => { setHeroInput(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => e.key === "Enter" && handleHeroSearch()}
                  className="flex-1 bg-transparent text-base text-white placeholder:text-white/35 outline-none"
                />
                <motion.button
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSurpriseMe}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all flex-shrink-0"
                  title="Surprise me!"
                >
                  <Shuffle className="h-4 w-4" />
                </motion.button>
                <Button
                  onClick={() => handleHeroSearch()}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 px-6 font-semibold flex-shrink-0"
                >
                  Plan Trip
                </Button>
              </div>

              {/* Suggestion dropdown */}
              <AnimatePresence>
                {showSuggestions && heroInput.length > 0 && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl overflow-hidden z-50"
                  >
                    {filteredSuggestions.map((s) => (
                      <button
                        key={s.name}
                        onClick={() => { setHeroInput(s.name); setShowSuggestions(false); handleHeroSearch(s.name); }}
                        className="flex w-full items-center gap-3 px-5 py-3 text-left text-white/80 hover:bg-white/10 transition-colors"
                      >
                        <span className="text-lg">{s.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-white">{s.name}</p>
                          <p className="text-xs text-white/40">{s.tag}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick destination pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-5 flex flex-wrap items-center justify-center gap-2"
            >
              <span className="text-xs text-white/30 mr-1">Popular:</span>
              {["Goa", "Jaipur", "Kerala", "Manali", "Bali"].map((d) => (
                <button
                  key={d}
                  onClick={() => handleHeroSearch(d)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 hover:bg-white/15 hover:text-white/80 hover:border-white/20 transition-all duration-300"
                >
                  {d}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* Rotating micro-stories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-14"
          >
            <MicroStory />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/15 p-1"
          >
            <div className="h-2 w-1 rounded-full bg-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Trending Destinations ─── */}
      <section className="section-padding bg-background overflow-hidden">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-secondary">Trending Now</span>
              <h2 className="text-3xl font-bold text-foreground md:text-5xl">
                Popular <span className="font-serif italic text-gradient">Destinations</span>
              </h2>
            </div>
            <Link to="/ai-planner" className="group flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors">
              Plan your own trip <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Link to={`/ai-planner?destination=${encodeURIComponent(dest.name)}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group relative overflow-hidden rounded-3xl aspect-[3/4] cursor-pointer"
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="mb-2 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">{dest.tag}</span>
                      <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                      <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{dest.trips}</span>
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-secondary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="section-padding bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-muted/30 via-transparent to-muted/30" />

        <div className="container-max relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-secondary">Why TripCircl</span>
            <h2 className="mb-5 text-3xl font-bold text-foreground md:text-5xl lg:text-6xl">
              Built for <span className="font-serif italic text-gradient">Real Travelers</span>
            </h2>
            <p className="mx-auto max-w-xl text-base text-muted-foreground leading-relaxed">
              Every feature designed from real travel pain points. No fluff, just what actually matters.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card/90 backdrop-blur-sm p-7 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 hover:border-secondary/20"
              >
                <div
                  className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${feature.border} ${feature.bg}`}
                >
                  <feature.icon className={`h-5 w-5 ${feature.color}`} strokeWidth={1.8} />
                </div>
                <h3 className="mb-3 text-lg font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="section-padding bg-background">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-secondary">How It Works</span>
            <h2 className="mb-5 text-3xl font-bold text-foreground md:text-5xl lg:text-6xl">
              Four Steps to <span className="font-serif italic text-gradient">Adventure</span>
            </h2>
          </motion.div>

          <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="absolute top-20 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent hidden lg:block" />

            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="relative text-center"
              >
                <div
                  className={`relative z-10 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl border ${step.border} ${step.bg}`}
                >
                  <step.icon className={`h-6 w-6 ${step.color}`} strokeWidth={1.8} />
                </div>
                <div className="mb-2 text-5xl font-black text-border font-serif select-none">{step.number}</div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="section-padding bg-muted/30 overflow-hidden">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-secondary">Real Stories</span>
            <h2 className="mb-5 text-3xl font-bold text-foreground md:text-5xl lg:text-6xl">
              Trusted by <span className="font-serif italic text-gradient">Thousands</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/8 hover:border-secondary/15"
              >
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${t.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="mb-5 flex gap-1">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-8 text-base leading-relaxed text-foreground/80">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 ${
                      t.color === "text-violet-600" ? "border-violet-200 bg-violet-50 text-violet-600" :
                      t.color === "text-blue-600" ? "border-blue-200 bg-blue-50 text-blue-600" :
                      "border-emerald-200 bg-emerald-50 text-emerald-600"
                    } text-xs font-bold`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role} · {t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary/70" />
        <motion.div
          className="absolute inset-0"
          animate={{ background: [
            "radial-gradient(ellipse at 30% 30%, hsl(263 83% 58% / 0.35), transparent 60%)",
            "radial-gradient(ellipse at 70% 70%, hsl(217 91% 60% / 0.25), transparent 60%)",
            "radial-gradient(ellipse at 30% 30%, hsl(263 83% 58% / 0.35), transparent 60%)",
          ]}}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container-max relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="mb-5 text-3xl font-bold text-white md:text-5xl lg:text-6xl">
              Ready to Plan Your <span className="font-serif italic text-white/90">Dream Trip?</span>
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-base text-white/50 leading-relaxed">
              Join thousands of travelers across India who plan smarter and travel better.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/ai-planner">
                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button size="xl" className="bg-white text-primary hover:bg-white/90 text-base shadow-2xl shadow-black/20 font-semibold">
                    Start Planning <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <a href="https://chat.whatsapp.com/LTkzdemDEg8AJCrXlyu4G6?mode=gi_t" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="hero-outline" size="xl" className="text-base">
                    Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
