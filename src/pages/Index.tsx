import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Users, MapPin, Calendar, Shield, Star, ArrowRight, Globe, MessageCircle, Wallet, Compass, Sparkles, Mountain, Camera, Zap, Heart, ChevronRight, Map, Brain, Clock } from "lucide-react";
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

const features = [
  {
    icon: Users,
    title: "Smart Matching",
    description: "Our algorithm pairs you with travelers who match your vibe, budget, and travel dates.",
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    border: "border-violet-200/60 dark:border-violet-500/20",
  },
  {
    icon: Brain,
    title: "AI Trip Planner",
    description: "Get hyper-detailed itineraries with hidden gems, local food spots, and cost breakdowns in seconds.",
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
  { number: "01", title: "Set Your Destination", description: "Pick where you want to go or let AI suggest the perfect spot based on your interests.", icon: MapPin, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-500/10", border: "border-violet-200/60 dark:border-violet-500/20" },
  { number: "02", title: "Find Your Tribe", description: "Get matched with like-minded travelers or invite friends to join your adventure.", icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200/60 dark:border-blue-500/20" },
  { number: "03", title: "Plan Together", description: "Collaborate on itineraries, split costs, and coordinate every detail effortlessly.", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200/60 dark:border-emerald-500/20" },
  { number: "04", title: "Experience It", description: "Hit the road with your crew. Create memories that last a lifetime.", icon: Mountain, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200/60 dark:border-amber-500/20" },
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
  { name: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=500&fit=crop", trips: "24 trips" },
  { name: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=500&fit=crop", trips: "18 trips" },
  { name: "Kerala", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=500&fit=crop", trips: "31 trips" },
  { name: "Ladakh", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=500&fit=crop", trips: "12 trips" },
];

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Hero ─── */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <img src={heroImage} alt="Travelers exploring mountains at golden hour" className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{ background: [
            "radial-gradient(ellipse at 20% 50%, hsl(263 83% 58% / 0.15), transparent 60%)",
            "radial-gradient(ellipse at 80% 50%, hsl(217 91% 60% / 0.15), transparent 60%)",
            "radial-gradient(ellipse at 20% 50%, hsl(263 83% 58% / 0.15), transparent 60%)",
          ]}}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div style={{ opacity: heroOpacity }} className="container-max relative z-10 px-4 pt-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-xl">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="h-4 w-4 text-secondary" />
              </motion.div>
              India's #1 Group Travel Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-7 text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-[5.5rem]"
          >
            Your Tribe.
            <br />
            Your <span className="font-serif italic bg-gradient-to-r from-violet-300 via-purple-200 to-blue-300 bg-clip-text text-transparent pl-1">Adventure.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mb-12 max-w-xl text-base text-white/65 md:text-lg leading-relaxed"
          >
            Find like-minded travelers. Plan unforgettable trips with AI. 
            Split costs, coordinate everything — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link to="/ai-planner">
              <Button variant="hero" size="xl" className="text-base group">
                Try AI Planner
                <motion.div className="ml-2" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Sparkles className="h-5 w-5" />
                </motion.div>
              </Button>
            </Link>
            <a href="https://chat.whatsapp.com/LTkzdemDEg8AJCrXlyu4G6?mode=gi_t" target="_blank" rel="noopener noreferrer">
              <Button variant="hero-outline" size="xl" className="text-base gap-2">
                <ArrowRight className="h-4 w-4" /> Join Waitlist
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-20 flex flex-wrap items-center justify-center gap-10 sm:gap-16"
          >
            {[
              { value: "50K+", label: "Travelers" },
              { value: "120+", label: "Destinations" },
              { value: "4.9", label: "Avg Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white md:text-3xl">{stat.value}</div>
                <div className="text-xs font-medium uppercase tracking-widest text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
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
            className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/20 p-1"
          >
            <div className="h-2 w-1 rounded-full bg-white/40" />
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
            <Link to="/explore" className="group flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors">
              View all destinations <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                <Link to="/explore">
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
                      <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                      <span className="text-xs font-medium text-white/60 uppercase tracking-wider">{dest.trips}</span>
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border) / 0.4) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border) / 0.4) 1px, transparent 1px)
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
              Every feature designed from real travel pain points. No fluff, just what actually matters when you're on the road.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card/90 backdrop-blur-sm p-7 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 hover:border-secondary/20"
              >
                <motion.div
                  whileHover={{ rotate: -5, scale: 1.05 }}
                  className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${feature.border} ${feature.bg}`}
                >
                  <feature.icon className={`h-5 w-5 ${feature.color}`} strokeWidth={1.8} />
                </motion.div>
                <h3 className="mb-3 text-lg font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>

                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-secondary opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  Learn more <ChevronRight className="h-3.5 w-3.5" />
                </div>
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
            {/* Connecting line (desktop) */}
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
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  className={`relative z-10 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl border ${step.border} ${step.bg}`}
                >
                  <step.icon className={`h-6 w-6 ${step.color}`} strokeWidth={1.8} />
                </motion.div>
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
                {/* Subtle top accent */}
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${t.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="mb-5 flex gap-1">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-8 text-base leading-relaxed text-foreground/80">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 ${
                      t.color === "text-violet-600" ? "border-violet-200 bg-violet-50 text-violet-600" :
                      t.color === "text-blue-600" ? "border-blue-200 bg-blue-50 text-blue-600" :
                      "border-emerald-200 bg-emerald-50 text-emerald-600"
                    } text-xs font-bold`}
                  >
                    {t.avatar}
                  </motion.div>
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
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />

        <div className="container-max relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
            >
              <Globe className="h-7 w-7 text-white" />
            </motion.div>

            <h2 className="mb-5 text-3xl font-bold text-white md:text-5xl lg:text-6xl">
              Ready to Find Your <span className="font-serif italic text-white/90">Tribe?</span>
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-base text-white/50 leading-relaxed">
              Join thousands of travelers across India who plan smarter, travel better, and make friends for life.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/ai-planner">
                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button size="xl" className="bg-white text-primary hover:bg-white/90 text-base shadow-2xl shadow-black/20 font-semibold">
                    Try AI Planner <Sparkles className="ml-2 h-5 w-5" />
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
