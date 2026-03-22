import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Sparkles, MapPin, Calendar, DollarSign, Users, Wand2, RotateCcw, Copy, Check,
  ChevronRight, Clock, Lightbulb, UtensilsCrossed, Compass, ArrowRight, Globe,
  Sun, Sunset, Moon, Backpack, MessageCircle, Plane, Heart, Share2,
  Mountain, Camera, Star, Zap, ChevronDown, Coffee, Utensils, Footprints, Eye,
  Download, Send, Twitter, Facebook, Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";

/* ─── Constants ─── */
const POPULAR_DESTINATIONS = [
  { name: "Goa", country: "India", emoji: "🏖️", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop" },
  { name: "Jaipur", country: "India", emoji: "🏰", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop" },
  { name: "Kerala", country: "India", emoji: "🌴", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop" },
  { name: "Manali", country: "India", emoji: "🏔️", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop" },
  { name: "Bali", country: "Indonesia", emoji: "🌺", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop" },
  { name: "Tokyo", country: "Japan", emoji: "🗼", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop" },
  { name: "Paris", country: "France", emoji: "🗼", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop" },
  { name: "Dubai", country: "UAE", emoji: "🌇", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop" },
  { name: "Udaipur", country: "India", emoji: "🏯", image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=400&h=300&fit=crop" },
  { name: "Bangkok", country: "Thailand", emoji: "🛕", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop" },
  { name: "Rishikesh", country: "India", emoji: "🧘", image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=400&h=300&fit=crop" },
  { name: "Singapore", country: "Singapore", emoji: "🦁", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop" },
];
const TRAVEL_STYLES = [
  { name: "Backpacker", icon: Backpack, desc: "Budget-friendly adventures", gradient: "from-emerald-500 to-teal-500" },
  { name: "Luxury", icon: Star, desc: "Premium experiences", gradient: "from-amber-500 to-orange-400" },
  { name: "Adventure", icon: Mountain, desc: "Thrilling activities", gradient: "from-blue-500 to-cyan-500" },
  { name: "Cultural", icon: Globe, desc: "Deep local immersion", gradient: "from-violet-500 to-purple-600" },
  { name: "Spiritual", icon: Compass, desc: "Temples & ashrams", gradient: "from-indigo-500 to-blue-500" },
  { name: "Foodie", icon: Coffee, desc: "Culinary exploration", gradient: "from-rose-500 to-pink-500" },
];
const INTEREST_TAGS = [
  "Hidden gems", "Street food", "Local markets", "Historical sites", "Nature trails",
  "Nightlife", "Art & culture", "Beach hopping", "Wellness & yoga", "Architecture",
  "Chai trails", "Sunrise spots", "Trekking", "Cooking classes", "Temple visits",
  "Wildlife safari", "Houseboat stays", "Palace tours", "Festivals", "Handicrafts",
];
const TRIP_PACES = [
  { name: "Relaxed", icon: Coffee, desc: "2-3 places/day, chill vibe", gradient: "from-amber-400 to-orange-400" },
  { name: "Moderate", icon: Footprints, desc: "3-4 places/day, balanced", gradient: "from-blue-400 to-cyan-500" },
  { name: "Fast-paced", icon: Zap, desc: "4-6 places/day, action-packed", gradient: "from-rose-500 to-pink-600" },
];
const PLACE_TYPES = [
  { name: "Must-visit attractions", icon: Camera, desc: "Top iconic landmarks", gradient: "from-indigo-500 to-purple-500" },
  { name: "Hidden gems", icon: Compass, desc: "Offbeat & secret places", gradient: "from-emerald-500 to-teal-500" },
  { name: "Mix of both", icon: Star, desc: "Icons + Local secrets", gradient: "from-amber-500 to-orange-500" },
];

/* ─── Destination images for day headers ─── */
const DAY_IMAGES = [
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop",
];

/* ─── Section Parser ─── */
interface Section {
  type: "intro" | "day" | "extras";
  dayNum?: number;
  title?: string;
  content: string;
}

function parseSections(text: string): Section[] {
  if (!text) return [];
  const sections: Section[] = [];
  const parts = text.split(/(?=^## Day \d)/m);
  parts.forEach((part) => {
    const trimmed = part.trim();
    if (!trimmed) return;
    const dayMatch = trimmed.match(/^## Day (\d+)\s*[:\-–—]?\s*(.*)/m);
    if (dayMatch) {
      sections.push({
        type: "day",
        dayNum: parseInt(dayMatch[1]),
        title: dayMatch[2].trim().replace(/\n.*$/s, ""),
        content: trimmed.replace(/^## Day \d+\s*[:\-–—]?\s*.*\n?/, "").trim(),
      });
    } else if (sections.length === 0) {
      if (/^## [🎒💡💰]/u.test(trimmed)) {
        sections.push({ type: "extras", content: trimmed });
      } else {
        // Clean intro: remove trailing --- or horizontal rules
        const cleanIntro = trimmed.replace(/---+\s*$/g, "").replace(/^---+\s*/gm, "").trim();
        if (cleanIntro) sections.push({ type: "intro", content: cleanIntro });
      }
    } else {
      sections.push({ type: "extras", content: trimmed });
    }
  });
  return sections;
}

/* ─── Parse activities from day content ─── */
interface Activity {
  type: "activity" | "food" | "tip" | "phrase" | "other";
  name?: string;
  description?: string;
  location?: string;
  time?: string;
  cost?: string;
  rawContent: string;
}

interface TimeBlock {
  period: "morning" | "afternoon" | "evening";
  activities: Activity[];
  rawContent: string;
}

function parseTimeBlocks(content: string): TimeBlock[] {
  const blocks: TimeBlock[] = [];
  const parts = content.split(/(?=^### )/m);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const headerMatch = trimmed.match(/^### .*(morning|afternoon|evening|sunrise|night)/i);
    if (headerMatch) {
      const period = headerMatch[1].toLowerCase().includes("morning") || headerMatch[1].toLowerCase().includes("sunrise")
        ? "morning"
        : headerMatch[1].toLowerCase().includes("afternoon")
          ? "afternoon"
          : "evening";

      const bodyContent = trimmed.replace(/^###.*\n?/, "").trim();
      blocks.push({ period, activities: [], rawContent: bodyContent });
    }
  }

  return blocks;
}

/* ─── Animated counter ─── */
const AnimatedCounter = ({ value, duration = 1.5 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (value === 0) { setCount(0); return; }
    let start = 0;
    const step = value / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{count}</span>;
};

/* ─── Floating particles ─── */
const FloatingParticle = ({ delay, x, size }: { delay: number; x: number; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-secondary/20"
    style={{ width: size, height: size, left: `${x}%` }}
    initial={{ y: "100vh", opacity: 0 }}
    animate={{ y: "-10vh", opacity: [0, 0.6, 0] }}
    transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, delay, ease: "linear" }}
  />
);

/* ─── Time Period Card ─── */
const periodConfig = {
  morning: {
    icon: Sun,
    label: "Morning",
    emoji: "🌅",
    gradient: "from-amber-500 to-orange-400",
    bgGradient: "from-amber-50 to-orange-50/30 dark:from-amber-500/5 dark:to-orange-500/3",
    borderColor: "border-amber-200/60 dark:border-amber-500/15",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    textColor: "text-amber-700 dark:text-amber-300",
    accentBg: "bg-amber-100 dark:bg-amber-500/10",
  },
  afternoon: {
    icon: Sun,
    label: "Afternoon",
    emoji: "☀️",
    gradient: "from-orange-400 to-rose-400",
    bgGradient: "from-orange-50 to-rose-50/30 dark:from-orange-500/5 dark:to-rose-500/3",
    borderColor: "border-orange-200/60 dark:border-orange-500/15",
    iconBg: "bg-gradient-to-br from-orange-400 to-rose-500",
    textColor: "text-orange-700 dark:text-orange-300",
    accentBg: "bg-orange-100 dark:bg-orange-500/10",
  },
  evening: {
    icon: Moon,
    label: "Evening",
    emoji: "🌙",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50/30 dark:from-indigo-500/5 dark:to-purple-500/3",
    borderColor: "border-indigo-200/60 dark:border-indigo-500/15",
    iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
    textColor: "text-indigo-700 dark:text-indigo-300",
    accentBg: "bg-indigo-100 dark:bg-indigo-500/10",
  },
};

/* ─── Enhanced markdown components for INSIDE time blocks ─── */
const createBlockMdComponents = (period: keyof typeof periodConfig) => {
  const config = periodConfig[period];
  return {
    h3: () => null, // Already rendered in TimeBlockCard header
    p: ({ children, ...props }: any) => {
      const text = String(children || "");

      // Location line
      if (/^📍/.test(text))
        return (
          <motion.div initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="mt-2.5 flex items-center gap-2.5 group cursor-default">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-all duration-300 group-hover:scale-110">
              <MapPin className="h-3.5 w-3.5 text-secondary" />
            </div>
            <span className="text-xs text-muted-foreground font-medium tracking-wide">{text.replace(/^📍\s*/, "")}</span>
          </motion.div>
        );

      // Time line
      if (/^⏰/.test(text))
        return (
          <div className="mt-1.5 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
              <Clock className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-xs text-muted-foreground font-medium tracking-wide">{text.replace(/^⏰\s*/, "")}</span>
          </div>
        );

      // Travel time line
      if (/^🚗/.test(text))
        return (
          <div className="mt-1.5 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10">
              <Footprints className="h-3.5 w-3.5 text-secondary" />
            </div>
            <span className="text-xs text-secondary font-medium tracking-wide">{text.replace(/^🚗\s*/, "")}</span>
          </div>
        );

      // Cost line — premium pill with icon
      if (/^💰/.test(text))
        return (
          <motion.div whileHover={{ scale: 1.03 }}
            className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/60 px-4 py-2 dark:from-emerald-500/8 dark:to-green-500/5 dark:border-emerald-500/15 shadow-sm">
            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">{text.replace(/^💰\s*/, "")}</span>
          </motion.div>
        );

      // Food recommendation — premium restaurant card
      if (/^🍽️/.test(text))
        return (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="mt-5 overflow-hidden rounded-2xl border border-orange-200/50 dark:border-orange-500/15 shadow-md hover:shadow-lg transition-shadow duration-500"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 px-5 py-2.5">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-white" />
                <span className="text-xs font-black text-white uppercase tracking-[0.15em]">Restaurant Pick</span>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 text-white/80 fill-white/80" />)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50/80 via-amber-50/40 to-orange-50/20 dark:from-orange-500/5 dark:to-amber-500/3 px-5 py-4">
              <p className="text-sm text-foreground/85 leading-relaxed font-medium" {...props}>
                {typeof children === 'string' ? children.replace(/^🍽️\s*/, "") : children}
              </p>
            </div>
          </motion.div>
        );

      // Regular paragraph
      return (
        <p className="text-sm leading-[1.8] text-muted-foreground" {...props}>{children}</p>
      );
    },
    strong: ({ children, ...props }: any) => (
      <strong className="font-bold text-foreground/90 bg-gradient-to-r from-secondary/10 to-transparent px-1 py-0.5 rounded" {...props}>{children}</strong>
    ),
    blockquote: ({ children, ...props }: any) => {
      const text = String(children?.toString() || "");
      const isTip = /pro tip|💡/i.test(text);
      const isPhrase = /local phrase|🗣️/i.test(text);
      return (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ x: 4, scale: 1.005 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`mt-5 overflow-hidden rounded-2xl border shadow-md ${
            isTip
              ? "border-blue-200/40 dark:border-blue-500/15"
              : isPhrase
                ? "border-purple-200/40 dark:border-purple-500/15"
                : "border-border"
          }`}
        >
          <div className={`flex items-center gap-2.5 px-5 py-3 ${
            isTip ? "bg-gradient-to-r from-blue-500 via-accent to-cyan-500" :
            isPhrase ? "bg-gradient-to-r from-purple-500 via-secondary to-pink-500" :
            "bg-muted"
          }`}>
            {isTip ? <Lightbulb className="h-4 w-4 text-white" /> :
             isPhrase ? <MessageCircle className="h-4 w-4 text-white" /> :
             <Lightbulb className="h-4 w-4 text-muted-foreground" />}
            <span className={`text-xs font-black uppercase tracking-[0.15em] ${
              isTip || isPhrase ? "text-white" : "text-muted-foreground"
            }`}>{isTip ? "Insider Tip" : isPhrase ? "Learn a Local Phrase" : "Note"}</span>
          </div>
          <div className={`px-5 py-4 ${
            isTip ? "bg-gradient-to-br from-blue-50/80 to-cyan-50/30 dark:from-blue-500/5 dark:to-cyan-500/3" :
            isPhrase ? "bg-gradient-to-br from-purple-50/80 to-pink-50/30 dark:from-purple-500/5 dark:to-pink-500/3" :
            "bg-muted/30"
          }`}>
            <div className="text-sm text-foreground/80 [&>p]:my-0 leading-relaxed italic" {...props}>{children}</div>
          </div>
        </motion.div>
      );
    },
    ul: ({ children, ...props }: any) => <ul className="mt-4 space-y-2.5" {...props}>{children}</ul>,
    li: ({ children, ...props }: any) => (
      <motion.li initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        className="flex items-start gap-3 text-sm text-muted-foreground" {...props}>
        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-r from-secondary to-accent shadow-sm" />
        <span className="leading-relaxed">{children}</span>
      </motion.li>
    ),
    table: ({ children, ...props }: any) => (
      <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 15 }} viewport={{ once: true }}
        className="mt-6 overflow-hidden rounded-2xl border border-border shadow-lg">
        <table className="w-full text-sm" {...props}>{children}</table>
      </motion.div>
    ),
    thead: ({ children, ...props }: any) => <thead className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" {...props}>{children}</thead>,
    th: ({ children, ...props }: any) => <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-[0.12em] text-foreground" {...props}>{children}</th>,
    td: ({ children, ...props }: any) => {
      const text = String(children || "");
      const isBold = /^\*\*/.test(text) || /total/i.test(text);
      return <td className={`border-t border-border/50 px-5 py-3.5 ${isBold ? "font-bold text-foreground" : "text-muted-foreground"}`} {...props}>{children}</td>;
    },
    hr: () => null,
  };
};

/* ─── Time Block Card ─── */
const TimeBlockCard = ({ period, content, dayIndex }: { period: keyof typeof periodConfig; content: string; dayIndex: number }) => {
  const config = periodConfig[period];
  const Icon = config.icon;
  const mdComponents = useMemo(() => createBlockMdComponents(period), [period]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border ${config.borderColor} bg-gradient-to-br ${config.bgGradient} transition-all duration-500 hover:shadow-xl hover:border-secondary/20`}
    >
      {/* Decorative corner glow */}
      <div className={`absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br ${config.gradient} opacity-[0.06] blur-3xl transition-opacity group-hover:opacity-[0.12]`} />
      <div className={`absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-gradient-to-br ${config.gradient} opacity-[0.04] blur-2xl`} />

      {/* Header */}
      <div className="relative flex items-center gap-3.5 px-5 py-4 border-b border-border/30">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.15 }}
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${config.iconBg} shadow-lg ring-2 ring-white/20`}
        >
          <Icon className="h-5 w-5 text-white" />
        </motion.div>
        <div>
          <span className="text-lg font-extrabold text-foreground tracking-tight">{config.emoji} {config.label}</span>
        </div>
        <div className="ml-auto flex items-center gap-2" />
      </div>

      {/* Content */}
      <div className="relative px-5 py-5 space-y-1">
        <ReactMarkdown components={mdComponents}>{content}</ReactMarkdown>
      </div>
    </motion.div>
  );
};

/* ─── Day Card ─── */
const dayGradients = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-500",
  "from-teal-500 to-emerald-500",
  "from-amber-500 to-yellow-500",
];

const DayCard = ({ section, index }: { section: Section; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const gradientColor = dayGradients[(section.dayNum || index) % dayGradients.length];
  const dayImage = DAY_IMAGES[(section.dayNum || index) % DAY_IMAGES.length];

  // Parse time blocks from content
  const timeBlocks = useMemo(() => parseTimeBlocks(section.content), [section.content]);
  const hasTimeBlocks = timeBlocks.length > 0;

  // Extract blockquotes that are outside time blocks (tips/phrases at day level)
  const dayLevelContent = useMemo(() => {
    if (!hasTimeBlocks) return section.content;
    // Get content that comes after all time blocks (like pro tips)
    const lastBlockEnd = section.content.lastIndexOf("###");
    const afterBlocks = section.content.substring(lastBlockEnd);
    const tipMatch = afterBlocks.match(/(>\s*.*(?:\n>.*)*)/g);
    return tipMatch ? tipMatch.join("\n\n") : "";
  }, [section.content, hasTimeBlocks]);

  // Fallback md components for non-time-block content
  const fallbackMd = useMemo(() => createBlockMdComponents("morning"), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Timeline connector */}
      <div className="absolute left-7 top-0 bottom-0 w-px hidden md:block">
        <div className="h-full w-full bg-gradient-to-b from-border via-secondary/20 to-border" />
      </div>

      <div className="flex gap-4 md:gap-8">
        {/* Timeline node */}
        <div className="relative z-10 hidden md:flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradientColor} text-white shadow-lg cursor-pointer`}
          >
            <span className="text-lg font-bold">{section.dayNum}</span>
          </motion.div>
          <motion.div
            className={`absolute top-0 h-14 w-14 rounded-2xl bg-gradient-to-br ${gradientColor} blur-xl opacity-30`}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Card */}
        <div className="flex-1 pb-8">
          <motion.div
            className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-500 hover:shadow-xl hover:border-secondary/20"
            whileHover={{ y: -3 }}
            layout
          >
            {/* Hero image header */}
            <div className="relative h-44 overflow-hidden">
              <motion.img
                src={dayImage}
                alt={`Day ${section.dayNum}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-card/60 to-transparent" />

              {/* Day badge overlay */}
              <div className="absolute bottom-4 left-5 right-5">
                <div className="flex items-end justify-between">
                  <div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${gradientColor} px-3 py-1 mb-2 shadow-lg`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Day {section.dayNum}</span>
                    </motion.div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight drop-shadow-sm">
                      {section.title || `Day ${section.dayNum}`}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-sm border border-border/50 transition-colors hover:bg-card"
                    >
                      <Heart className={`h-4 w-4 transition-all duration-300 ${liked ? "fill-rose-500 text-rose-500 scale-110" : "text-muted-foreground"}`} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setExpanded(!expanded)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-sm border border-border/50 transition-colors hover:bg-card"
                    >
                      <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Mobile day badge */}
              <div className={`absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradientColor} text-white shadow-lg md:hidden`}>
                <span className="text-sm font-bold">{section.dayNum}</span>
              </div>
            </div>

            {/* Card Content */}
            {/* Preview snippet when collapsed */}
            {!expanded && (
              <div className="px-5 py-4 md:px-7">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {timeBlocks.length > 0 ? (
                    <>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                        🌅 Morning
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
                        ☀️ Afternoon
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                        🌙 Evening
                      </span>
                      <span className="ml-auto text-xs text-secondary font-semibold cursor-pointer hover:underline" onClick={() => setExpanded(true)}>Expand →</span>
                    </>
                  ) : (
                    <span className="text-xs line-clamp-2">{section.content.slice(0, 150)}...</span>
                  )}
                </div>
              </div>
            )}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 py-6 md:px-7">
                    {hasTimeBlocks ? (
                      <div className="space-y-5">
                        {timeBlocks.map((block, i) => (
                          <TimeBlockCard
                            key={block.period}
                            period={block.period}
                            content={block.rawContent}
                            dayIndex={index + i}
                          />
                        ))}
                        {/* Day-level tips/phrases */}
                        {dayLevelContent && (
                          <div className="pt-2">
                            <ReactMarkdown components={fallbackMd}>{dayLevelContent}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    ) : (
                      <ReactMarkdown components={fallbackMd}>{section.content}</ReactMarkdown>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Extras Card ─── */
const extrasMd = {
  ...createBlockMdComponents("morning"),
  h2: ({ children, ...props }: any) => {
    const text = String(children || "");
    const isPacking = /packing|🎒/i.test(text);
    const isBudget = /budget|💰/i.test(text);
    const isTips = /tips|💡/i.test(text);
    const icon = isPacking ? <Backpack className="h-5 w-5" /> : isBudget ? <span className="text-lg">💰</span> : <Lightbulb className="h-5 w-5" />;
    const gradient = isPacking ? "from-secondary to-purple-600" : isBudget ? "from-emerald-500 to-teal-500" : "from-accent to-blue-600";
    return (
      <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        className="mb-4 flex items-center gap-3 first:mt-0 mt-8">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}>{icon}</div>
        <h2 className="text-xl font-bold text-foreground" {...props}>{children}</h2>
      </motion.div>
    );
  },
};

const ExtrasCard = ({ content }: { content: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -2 }}
    className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm transition-shadow hover:shadow-lg"
  >
    <ReactMarkdown components={extrasMd}>{content}</ReactMarkdown>
  </motion.div>
);

/* ─── Premium Loading Experience ─── */
const LoadingExperience = ({ destination }: { destination: string }) => {
  const loadingPhrases = [
    "Mapping optimal routes between attractions...",
    "Finding hidden gems only locals know...",
    "Curating the best restaurants & cafés...",
    "Optimizing your daily schedule by proximity...",
    "Adding insider tips from seasoned travelers...",
    "Calculating detailed cost breakdowns...",
    "Discovering photo-worthy golden hour spots...",
    "Planning the perfect neighborhood clusters...",
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setPhraseIdx((p) => (p + 1) % loadingPhrases.length), 2800);
    return () => clearInterval(timer);
  }, [loadingPhrases.length]);
  useEffect(() => {
    const timer = setInterval(() => setProgress((p) => Math.min(p + 0.8, 92)), 200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative py-16">
      {/* Premium animated compass */}
      <motion.div className="mx-auto mb-14 flex h-56 w-56 items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
        {/* Outer ring */}
        <motion.div className="absolute h-56 w-56 rounded-full border border-secondary/15"
          animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
          {[0, 90, 180, 270].map((deg) => (
            <motion.div key={deg} className="absolute h-2 w-2 rounded-full bg-secondary/30" style={{ top: "50%", left: "50%", transform: `rotate(${deg}deg) translateY(-110px) translate(-50%, -50%)` }} />
          ))}
        </motion.div>
        {/* Middle ring - dashed */}
        <motion.div className="absolute h-40 w-40 rounded-full border-2 border-dashed border-secondary/20"
          animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        {/* Inner ring */}
        <motion.div className="absolute h-28 w-28 rounded-full border border-accent/15"
          animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
        {/* Center icon */}
        <motion.div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent shadow-2xl shadow-secondary/30"
          animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }} transition={{ duration: 4, repeat: Infinity }}>
          <Compass className="h-10 w-10 text-primary-foreground" />
        </motion.div>
        {/* Orbiting dots */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div key={i} className="absolute h-2.5 w-2.5 rounded-full bg-gradient-to-r from-secondary to-accent shadow-lg shadow-secondary/50"
            animate={{ rotate: 360 }} transition={{ duration: 3 + i * 1.5, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
            style={{ transformOrigin: `${55 + i * 12}px 0px`, top: "50%", left: "50%", marginTop: -5, marginLeft: -5 }} />
        ))}
      </motion.div>

      <motion.div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-foreground mb-3">
          Crafting your perfect <span className="text-gradient">{destination}</span> adventure
        </h3>
        <AnimatePresence mode="wait">
          <motion.p key={phraseIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} className="text-muted-foreground text-base">
            {loadingPhrases[phraseIdx]}
          </motion.p>
        </AnimatePresence>
        {/* Progress bar */}
        <div className="mx-auto mt-6 max-w-xs h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-secondary to-accent"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <p className="mt-2 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Generating itinerary</p>
      </motion.div>

      {/* Skeleton cards with shimmer */}
      <div className="space-y-5">
        {[0, 1, 2].map((i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }} className="flex gap-6">
            <div className="hidden md:block">
              <motion.div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/20"
                animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
            </div>
            <div className="flex-1 overflow-hidden rounded-3xl border border-border bg-card">
              <motion.div className="h-32 bg-gradient-to-r from-muted/50 via-muted to-muted/50"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                style={{ backgroundSize: "200% 100%" }}
                transition={{ duration: 2, repeat: Infinity }} />
              <div className="p-6 space-y-3">
                <motion.div className="h-3 w-20 rounded-full bg-secondary/20"
                  animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
                <motion.div className="h-5 w-52 rounded-lg bg-muted"
                  animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((j) => (
                    <motion.div key={j} className="h-20 rounded-xl bg-muted/50"
                      animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 + j * 0.1 }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ─── Day Navigation Pills ─── */
const DayNav = ({ sections, activeDay, onSelect }: { sections: Section[]; activeDay: number | null; onSelect: (day: number) => void }) => {
  const daySections = sections.filter((s) => s.type === "day");
  if (daySections.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-20 z-30 mb-8 flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-border bg-card/95 p-2 shadow-lg backdrop-blur-xl scrollbar-none"
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/10">
        <Compass className="h-4 w-4 text-secondary" />
      </div>
      <div className="h-5 w-px bg-border mx-1" />
      {daySections.map((s, i) => (
        <motion.button
          key={s.dayNum}
          onClick={() => onSelect(s.dayNum!)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`flex-shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 ${
            activeDay === s.dayNum
              ? "bg-gradient-to-r from-secondary to-accent text-white shadow-md"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Day {s.dayNum}
        </motion.button>
      ))}
    </motion.div>
  );
};

/* ─── Step indicator (5 steps) ─── */
const STEP_LABELS = ["Destination", "Dates", "Style", "Vibe", "Review"];
const StepIndicator = ({ step }: { step: number }) => (
  <div className="flex items-center gap-1 mb-8">
    {STEP_LABELS.map((label, i) => {
      const s = i + 1;
      return (
        <div key={s} className="flex items-center gap-1.5">
          <motion.div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-500 ${
              s === step ? "bg-secondary text-secondary-foreground shadow-md" :
              s < step ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"
            }`}
          >
            {s < step ? <Check className="h-3.5 w-3.5" /> : s}
          </motion.div>
          <span className={`text-[11px] font-medium hidden sm:block ${s === step ? "text-foreground" : "text-muted-foreground"}`}>
            {label}
          </span>
          {s < 5 && <div className={`h-px w-4 sm:w-6 transition-colors duration-500 ${s < step ? "bg-secondary" : "bg-border"}`} />}
        </div>
      );
    })}
  </div>
);

/* ─── Trip DNA Card ─── */
const TripDNA = ({ destination, country, travelStyles, tripPace, placeType, budget, travelers, interests, startDate, endDate }: {
  destination: string; country: string; travelStyles: string[]; tripPace: string; placeType: string;
  budget: string; travelers: string; interests: string[]; startDate: string; endDate: string;
}) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
    className="rounded-2xl border border-secondary/20 bg-gradient-to-br from-secondary/5 via-card to-accent/5 p-6 mb-6">
    <div className="flex items-center gap-2 mb-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
        <Sparkles className="h-4 w-4 text-secondary" />
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">Your Trip Profile</p>
        <p className="text-[10px] text-muted-foreground">AI will personalize everything to match you</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary">
        <MapPin className="h-3 w-3" /> {destination}{country ? `, ${country}` : ""}
      </span>
      {tripPace && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">{tripPace === "Relaxed" ? "🧘" : tripPace === "Fast-paced" ? "⚡" : "🚶"} {tripPace}</span>}
      {placeType && <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">{placeType === "Hidden gems" ? "💎" : placeType === "Must-visit attractions" ? "📸" : "✨"} {placeType}</span>}
      {travelStyles.map(style => (
        <span key={style} className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">{style}</span>
      ))}
      {budget && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">₹{budget}</span>}
      {travelers && <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"><Users className="h-3 w-3" /> {travelers}</span>}
      {startDate && endDate && <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground"><Calendar className="h-3 w-3" /> {startDate} → {endDate}</span>}
      {interests.length > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"><Heart className="h-3 w-3" /> {interests.length} interests</span>}
    </div>
  </motion.div>
);

/* ─── Main Page ─── */
const AIPlanner = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const resultRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [refineInput, setRefineInput] = useState("");

  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("");
  const [travelStyles, setTravelStyles] = useState<string[]>([]);
  const [tripPace, setTripPace] = useState("Moderate");
  const [placeType, setPlaceType] = useState("Mix of both");
  const [interests, setInterests] = useState<string[]>([]);
  const [extraPrompt, setExtraPrompt] = useState("");

  const [formStep, setFormStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [generationDone, setGenerationDone] = useState(false);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  /* ─── Auth Guard ─── */
  useEffect(() => {
    if (!authLoading && !user) {
      toast({ title: "Login Required", description: "You must be logged in to use the AI Planner.", variant: "default" });
      navigate("/login");
    }
  }, [user, authLoading, navigate, toast]);

  /* ─── Read destination from URL (homepage search) ─── */
  useEffect(() => {
    const dest = searchParams.get("destination");
    const surprise = searchParams.get("surprise");
    if (dest) {
      setDestination(dest);
      // Try to auto-detect country for popular Indian destinations
      const indianDests = /goa|jaipur|kerala|manali|rishikesh|udaipur|ladakh|mumbai|delhi|bangalore|hyderabad|chennai|hampi|spiti|pondicherry|coorg|meghalaya|andaman|pushkar|alleppey|darjeeling|rann of kutch/i;
      if (indianDests.test(dest)) setCountry("India");
      if (surprise === "true") setFormStep(2);
      else setFormStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sections = useMemo(() => parseSections(result), [result]);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    if (loading && !result && resultRef.current) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  }, [loading, result]);

  // Auto-scroll to form top when moving to next step
  useEffect(() => {
    if (formStep > 1 && formRef.current) {
      const y = formRef.current.getBoundingClientRect().top + window.scrollY - 120; // offset for sticky navbar
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [formStep]);

  const toggleInterest = useCallback((tag: string) => {
    setInterests((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }, []);

  const selectDestination = (dest: { name: string; country: string }) => {
    setDestination(dest.name);
    setCountry(dest.country);
  };

  const scrollToDay = (dayNum: number) => {
    setActiveDay(dayNum);
    const el = document.getElementById(`day-${dayNum}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleGenerate = async () => {
    if (!destination) {
      toast({ title: "Where to?", description: "Please enter a destination.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult("");
    setGenerationDone(false);
    setActiveDay(null);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          destination, country,
          startDate: startDate || undefined, endDate: endDate || undefined,
          travelStyle: travelStyles.length > 0 ? travelStyles.join(", ") : undefined, budget: budget || undefined,
          travelers: travelers || undefined,
          interests: interests.length > 0 ? interests.join(", ") : undefined,
          prompt: extraPrompt || undefined,
          tripPace,
          placeType,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: "Failed to generate" }));
        throw new Error(errData.error || "Failed to generate itinerary");
      }
      if (!resp.body) throw new Error("No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) { fullText += content; setResult(fullText); }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":") || raw.trim() === "" || !raw.startsWith("data: ")) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) { fullText += content; setResult(fullText); }
          } catch { /* ignore */ }
        }
      }
      setGenerationDone(true);
    } catch (err: any) {
      toast({ title: "Generation Failed", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast({ title: "Copied! 📋" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `🌍 Check out this amazing ${destination} itinerary I generated on TripCircl!\n\n${stats.days} days · ${stats.activities} activities · ${stats.tips} pro tips\n\nPlan yours free at tripcircl.com/ai-planner`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareTwitter = () => {
    const text = `Just planned my dream ${destination} trip with @TripCircl's AI Planner ✨\n\n${stats.days} days, ${stats.activities} activities, hidden gems & more!\n\nPlan yours free 👇`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent("https://tripcircl.com/ai-planner")}`, "_blank");
  };

  const handleReset = () => {
    setResult(""); setGenerationDone(false); setActiveDay(null); setFormStep(1);
    setDestination(""); setCountry(""); setStartDate(""); setEndDate("");
    setBudget(""); setTravelers(""); setTravelStyles([]); setInterests([]); setExtraPrompt("");
    setTripPace("Moderate"); setPlaceType("Mix of both"); setRefineInput("");
  };

  const handleRefine = () => {
    if (!refineInput) return;
    setExtraPrompt(refineInput);
    setRefineInput("");
    handleGenerate();
  };

  const stats = useMemo(() => {
    const days = sections.filter((s) => s.type === "day").length;
    const activities = (result.match(/\*\*[^*]+\*\*\s*—/g) || []).length;
    const tips = (result.match(/pro tip|💡/gi) || []).length;
    const foods = (result.match(/🍽️/g) || []).length;
    return { days, activities, tips, foods };
  }, [result, sections]);

  const canProceedStep1 = destination.length > 0;
  const canProceedStep2 = startDate && endDate && budget && travelers;
  const canProceedStep3 = travelStyles.length > 0;
  const canProceedStep4 = tripPace && placeType;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ─── Immersive Hero ─── */}
      <motion.div ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative overflow-hidden pt-24 pb-8 md:pt-28 md:pb-12"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 1.2} x={10 + i * 15} size={4 + (i % 3) * 3} />
          ))}
          <motion.div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full opacity-15 blur-[100px]" style={{ background: "hsl(var(--secondary))" }}
            animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute top-0 right-1/4 h-72 w-72 rounded-full opacity-10 blur-[80px]" style={{ background: "hsl(var(--accent))" }}
            animate={{ x: [0, -30, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        </div>

        <div className="container-max relative px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-6 py-2.5 shadow-sm backdrop-blur-sm">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="h-4 w-4 text-secondary" />
              </motion.div>
              <span className="text-sm font-medium text-secondary">AI Travel Intelligence</span>
              <motion.div className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            </motion.div>

            <h1 className="mb-5 font-serif text-4xl font-bold italic tracking-tight text-foreground md:text-6xl lg:text-7xl">
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                Plan Your{" "}
              </motion.span>
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="relative inline-block">
                <span className="text-gradient">Dream Trip</span>
                <motion.span className="absolute -bottom-1 left-0 h-1 rounded-full bg-gradient-to-r from-secondary to-accent"
                  initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }} />
              </motion.span>
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="mx-auto max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed">
              Get a hyper-detailed, personalized itinerary with hidden gems, cost estimates, and local insider tips — all in seconds.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              {[
                { icon: <Zap className="h-3.5 w-3.5 text-amber-500" />, text: "15-sec generation" },
                { icon: <Globe className="h-3.5 w-3.5 text-accent" />, text: "100+ destinations" },
                { icon: <Star className="h-3.5 w-3.5 text-secondary" />, text: "Completely free" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">{item.icon}<span>{item.text}</span></div>
              ))}
            </motion.div>

            {/* Social proof avatars */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
              className="mt-8 flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                {["🧑‍💻", "👩‍🎨", "🧑‍🍳", "👨‍✈️", "👩‍🔬"].map((emoji, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 + i * 0.1, type: "spring", stiffness: 300 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-sm shadow-sm">
                    {emoji}
                  </motion.div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-foreground">10,000+ itineraries generated</p>
                <p className="text-[10px] text-muted-foreground">Loved by travelers across India & beyond</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div ref={formRef} className="container-max px-4 pb-20">
        <div className="mx-auto max-w-4xl">

          {/* ─── Multi-Step Form ─── */}
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30, transition: { duration: 0.4 } }} className="mb-8">

                <StepIndicator step={formStep} />

                <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                  <AnimatePresence mode="wait">
                    {formStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }} className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                            <MapPin className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-foreground">Where do you want to go?</h2>
                            <p className="text-sm text-muted-foreground">Pick a destination or type your own</p>
                          </div>
                        </div>

                        <div className="mb-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {POPULAR_DESTINATIONS.map((dest, i) => (
                            <motion.button
                              key={dest.name}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * i, duration: 0.4 }}
                              whileHover={{ y: -4, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => selectDestination(dest)}
                              className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                                destination === dest.name
                                  ? "border-secondary shadow-lg ring-2 ring-secondary/20"
                                  : "border-border hover:border-secondary/30 hover:shadow-md"
                              }`}
                            >
                              {/* Image background */}
                              <div className="relative h-16 overflow-hidden">
                                <img
                                  src={dest.image}
                                  alt={dest.name}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/placeholder.svg";
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                              </div>
                              <div className="relative px-2 pb-2 -mt-2 text-center">
                                <span className="text-lg">{dest.emoji}</span>
                                <h3 className="font-bold text-foreground text-xs">{dest.name}</h3>
                                <p className="text-[9px] text-muted-foreground">{dest.country}</p>
                              </div>
                              {destination === dest.name && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                  className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-white shadow-md">
                                  <Check className="h-3 w-3" />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                              <MapPin className="h-3.5 w-3.5 text-secondary" /> Destination
                            </label>
                            <Input placeholder="e.g., Goa, Jaipur, Manali..." value={destination}
                              onChange={(e) => setDestination(e.target.value)}
                              className="h-12 rounded-xl border-border/60 transition-all focus:border-secondary/50 focus:shadow-sm" />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                              <Globe className="h-3.5 w-3.5 text-muted-foreground" /> Country
                            </label>
                            <Input placeholder="e.g., India" value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="h-12 rounded-xl border-border/60 transition-all focus:border-secondary/50 focus:shadow-sm" />
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <Button onClick={() => setFormStep(2)} disabled={!canProceedStep1}
                            variant="default" className="gap-2 rounded-xl">
                            Next: Preferences <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {formStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }} className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                            <Calendar className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-foreground">When are you going?</h2>
                            <p className="text-sm text-muted-foreground">Set your travel dates and budget</p>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><Calendar className="h-3.5 w-3.5 text-secondary" /> Start Date</label>
                            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-12 rounded-xl" />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /> End Date</label>
                            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-12 rounded-xl" />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><span className="text-secondary font-bold text-sm">₹</span> Budget (INR)</label>
                            <Input placeholder="e.g., 20000" value={budget} onChange={(e) => setBudget(e.target.value)} className="h-12 rounded-xl" />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><Users className="h-3.5 w-3.5 text-muted-foreground" /> Travelers</label>
                            <Input type="number" placeholder="2" min="1" value={travelers} onChange={(e) => setTravelers(e.target.value)} className="h-12 rounded-xl" />
                          </div>
                        </div>

                        <p className="mt-4 text-xs font-medium text-amber-500">All fields are required to craft the perfect itinerary.</p>

                        <div className="mt-6 flex justify-between">
                          <Button variant="ghost" onClick={() => setFormStep(1)} className="gap-2 rounded-xl">Back</Button>
                          <Button onClick={() => setFormStep(3)} disabled={!canProceedStep2} variant="default" className="gap-2 rounded-xl">
                            Next: Travel Style <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {formStep === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }} className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                            <Compass className="h-5 w-5 text-violet-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-foreground">How do you like to travel?</h2>
                            <p className="text-sm text-muted-foreground">Pick a style that matches your vibe</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {TRAVEL_STYLES.map((style, i) => {
                            const StyleIcon = style.icon;
                            return (
                              <motion.button key={style.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.03 * i }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => setTravelStyles(prev => prev.includes(style.name) ? prev.filter(s => s !== style.name) : [...prev, style.name])}
                                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300 ${
                                  travelStyles.includes(style.name)
                                    ? "border-secondary bg-secondary/5 shadow-md ring-1 ring-secondary/20"
                                    : "border-border hover:border-secondary/30 hover:shadow-sm"
                                }`}>
                                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${style.gradient} shadow-sm`}>
                                  <StyleIcon className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{style.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{style.desc}</p>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>

                        <div className="mt-6 flex justify-between">
                          <Button variant="ghost" onClick={() => setFormStep(2)} className="gap-2 rounded-xl">Back</Button>
                          <Button onClick={() => setFormStep(4)} disabled={!canProceedStep3} variant="default" className="gap-2 rounded-xl">
                            Next: Pace & Places <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {formStep === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }} className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                            <Zap className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-foreground">Set your trip vibe</h2>
                            <p className="text-sm text-muted-foreground">Choose your pace and type of experiences</p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="mb-3 block text-sm font-medium text-foreground">Trip Pace</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {TRIP_PACES.map((pace, i) => {
                              const PaceIcon = pace.icon;
                              return (
                                <motion.button key={pace.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.03 * i }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                  onClick={() => setTripPace(pace.name)}
                                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300 ${
                                    tripPace === pace.name
                                      ? "border-secondary bg-secondary/5 shadow-md ring-1 ring-secondary/20"
                                      : "border-border hover:border-secondary/30 hover:shadow-sm"
                                  }`}>
                                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${pace.gradient} shadow-sm`}>
                                    <PaceIcon className="h-4 w-4 text-white" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">{pace.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{pace.desc}</p>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="mb-3 block text-sm font-medium text-foreground">Types of Places</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {PLACE_TYPES.map((type, i) => {
                              const TypeIcon = type.icon;
                              return (
                                <motion.button key={type.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.03 * i }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                  onClick={() => setPlaceType(type.name)}
                                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300 ${
                                    placeType === type.name
                                      ? "border-secondary bg-secondary/5 shadow-md ring-1 ring-secondary/20"
                                      : "border-border hover:border-secondary/30 hover:shadow-sm"
                                  }`}>
                                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${type.gradient} shadow-sm`}>
                                    <TypeIcon className="h-4 w-4 text-white" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">{type.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{type.desc}</p>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="mt-6 flex justify-between">
                          <Button variant="ghost" onClick={() => setFormStep(3)} className="gap-2 rounded-xl">Back</Button>
                          <Button onClick={() => setFormStep(5)} disabled={!canProceedStep4} variant="default" className="gap-2 rounded-xl">
                            Next: Review <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {formStep === 5 && (
                      <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }} className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                            <Sparkles className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-foreground">Review & Generate</h2>
                            <p className="text-sm text-muted-foreground">Your Trip DNA — everything the AI will use</p>
                          </div>
                        </div>

                        {/* Trip DNA card */}
                        <TripDNA
                          destination={destination} country={country} travelStyles={travelStyles}
                          tripPace={tripPace} placeType={placeType} budget={budget}
                          travelers={travelers} interests={interests} startDate={startDate} endDate={endDate}
                        />

                        {/* Interests (inline on review) */}
                        <div className="mb-4">
                          <label className="mb-2 block text-sm font-medium text-foreground">Interests (optional)</label>
                          <div className="flex flex-wrap gap-1.5">
                            {INTEREST_TAGS.map((tag) => (
                              <button key={tag} onClick={() => toggleInterest(tag)}
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                                  interests.includes(tag)
                                    ? "border-accent bg-accent/10 text-accent"
                                    : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                                }`}>
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Extra prompt */}
                        <div className="mb-6">
                          <label className="mb-2 block text-sm font-medium text-foreground">Anything else?</label>
                          <Textarea placeholder="e.g., 'Traveling with kids', 'Anniversary trip', 'Vegetarian only'..."
                            value={extraPrompt} onChange={(e) => setExtraPrompt(e.target.value)}
                            className="min-h-[70px] resize-none rounded-xl" />
                        </div>

                        <div className="flex justify-between">
                          <Button variant="ghost" onClick={() => setFormStep(4)} className="gap-2 rounded-xl">Back</Button>
                          <Button onClick={handleGenerate} disabled={loading || !destination} variant="hero" size="lg" className="gap-3 rounded-xl">
                            <Wand2 className="h-5 w-5" />
                            Generate My Itinerary
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Results ─── */}
          <div ref={resultRef}>
            <AnimatePresence>
              {(result || loading) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>

                  {loading && !result && <LoadingExperience destination={destination} />}

                  {/* Top bar */}
                  {result && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="mb-8 overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
                      {/* Gradient accent bar */}
                      <div className="h-1.5 bg-gradient-to-r from-secondary via-accent to-secondary" />
                      <div className="flex flex-wrap items-center justify-between gap-4 p-5 md:px-7">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg"
                            whileHover={{ rotate: 5, scale: 1.05 }}
                          >
                            {loading ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                <Sparkles className="h-6 w-6 text-primary-foreground" />
                              </motion.div>
                            ) : <Sparkles className="h-6 w-6 text-primary-foreground" />}
                          </motion.div>
                          <div>
                            <h3 className="font-bold text-foreground text-xl">{destination}{country ? `, ${country}` : ""}</h3>
                            <p className="text-sm text-muted-foreground">
                              {loading ? "Generating your itinerary..." :
                                `${stats.days} days · ${stats.activities} activities · ${stats.tips} pro tips`}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {result && (
                            <>
                              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 rounded-xl">
                                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                {copied ? "Copied!" : "Copy"}
                              </Button>
                              <Button variant="outline" size="sm" onClick={handleShareWhatsApp} className="gap-2 rounded-xl text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-500/20 dark:hover:bg-emerald-500/10">
                                <Send className="h-4 w-4" /> WhatsApp
                              </Button>
                              <Button variant="outline" size="sm" onClick={handleShareTwitter} className="gap-2 rounded-xl text-sky-500 border-sky-200 hover:bg-sky-50 dark:border-sky-500/20 dark:hover:bg-sky-500/10">
                                <Twitter className="h-4 w-4" /> Tweet
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2 rounded-xl">
                            <RotateCcw className="h-4 w-4" /> New Plan
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Animated Stats */}
                  {generationDone && stats.days > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }} className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { icon: <Calendar className="h-5 w-5" />, value: stats.days, label: "Days", gradient: "from-violet-500 to-purple-600", bg: "from-violet-500/10 to-purple-500/5 border-secondary/20" },
                        { icon: <Compass className="h-5 w-5" />, value: stats.activities, label: "Activities", gradient: "from-blue-500 to-cyan-500", bg: "from-blue-500/10 to-cyan-500/5 border-accent/20" },
                        { icon: <Lightbulb className="h-5 w-5" />, value: stats.tips, label: "Pro Tips", gradient: "from-amber-500 to-orange-500", bg: "from-amber-500/10 to-orange-500/5 border-amber-200 dark:border-amber-500/20" },
                        { icon: <UtensilsCrossed className="h-5 w-5" />, value: stats.foods, label: "Food Spots", gradient: "from-rose-500 to-pink-500", bg: "from-rose-500/10 to-pink-500/5 border-rose-200 dark:border-rose-500/20" },
                      ].map((s, i) => (
                        <motion.div key={s.label}
                          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * i, type: "spring", stiffness: 200 }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          className={`relative overflow-hidden flex flex-col items-center gap-1.5 rounded-2xl border bg-gradient-to-br p-5 ${s.bg}`}>
                          {/* Icon with gradient bg */}
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-md mb-1`}>
                            {s.icon}
                          </div>
                          <span className="text-3xl font-black text-foreground"><AnimatedCounter value={s.value} /></span>
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Day nav pills */}
                  {sections.filter(s => s.type === "day").length > 1 && (
                    <DayNav sections={sections} activeDay={activeDay} onSelect={scrollToDay} />
                  )}

                  {/* ─── Trip at a Glance ─── */}
                  {generationDone && sections.filter(s => s.type === "day").length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="mb-8 rounded-3xl border border-border bg-card p-5 md:p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
                            <Map className="h-4 w-4 text-secondary" />
                          </div>
                          <h3 className="text-sm font-bold text-foreground">Trip at a Glance</h3>
                        </div>
                        <button
                          onClick={() => {
                            const allCards = document.querySelectorAll('[data-day-card]');
                            // Toggle all — if any are collapsed, expand all; else collapse all
                            allCards.forEach(el => el.dispatchEvent(new CustomEvent('toggle-expand')));
                          }}
                          className="text-xs font-semibold text-secondary hover:underline"
                        >
                          Click days below to explore ↓
                        </button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {sections.filter(s => s.type === "day").map((s, i) => (
                          <motion.button
                            key={s.dayNum}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => scrollToDay(s.dayNum!)}
                            className="flex items-center gap-3 rounded-xl border border-border bg-gradient-to-r from-card to-muted/30 p-3 text-left transition-all hover:shadow-md hover:border-secondary/30"
                          >
                            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${dayGradients[(s.dayNum || i) % dayGradients.length]} text-white text-sm font-bold shadow-md`}>
                              {s.dayNum}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-foreground truncate">{s.title || `Day ${s.dayNum}`}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {parseTimeBlocks(s.content).length > 0
                                  ? `${parseTimeBlocks(s.content).length} time blocks`
                                  : "Detailed plan inside"
                                }
                              </p>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Intro section */}
                  {sections.filter(s => s.type === "intro").map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="mb-8 relative overflow-hidden rounded-3xl border border-border shadow-sm">
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5" />
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-accent" />
                      <div className="relative px-6 py-6 md:px-8">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-accent text-white shadow-md mt-0.5">
                            <Eye className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-2">Trip Overview</h3>
                            <p className="text-base leading-relaxed text-foreground/80">{s.content}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Day cards */}
                  <div className="space-y-2">
                    {sections.filter(s => s.type === "day").map((s, i) => (
                      <div key={s.dayNum} id={`day-${s.dayNum}`} className="scroll-mt-32">
                        <DayCard section={s} index={i} />
                      </div>
                    ))}
                  </div>

                  {/* Streaming indicator */}
                  {loading && result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="mt-8 flex items-center justify-center gap-3 py-8">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div key={i} className="h-2.5 w-2.5 rounded-full bg-secondary"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">Still crafting your adventure...</span>
                    </motion.div>
                  )}

                  {/* Extras sections */}
                  {sections.filter(s => s.type === "extras").map((s, i) => (
                    <div key={i} className="mt-6"><ExtrasCard content={s.content} /></div>
                  ))}

                  {/* Bottom CTA */}
                  {generationDone && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-12 space-y-6"
                    >
                      {/* Share & Refer CTA */}
                      <div className="relative overflow-hidden rounded-3xl border border-secondary/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-card to-accent/5" />
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <motion.div className="absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-10 blur-3xl"
                            style={{ background: "hsl(var(--secondary))" }}
                            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                          <motion.div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full opacity-10 blur-3xl"
                            style={{ background: "hsl(var(--accent))" }}
                            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} />
                        </div>
                        <div className="relative px-6 py-12 text-center">
                          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                            <Share2 className="mx-auto h-10 w-10 text-secondary mb-4" />
                          </motion.div>
                          <h3 className="text-3xl font-bold text-foreground mb-2">Share this magic ✨</h3>
                          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-base">
                            Your friends deserve an epic trip too. Share this itinerary and let them plan their own!
                          </p>
                          <div className="flex flex-wrap gap-3 justify-center mb-8">
                            <Button onClick={handleShareWhatsApp} size="lg" className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                              <Send className="h-4 w-4" /> Share on WhatsApp
                            </Button>
                            <Button onClick={handleShareTwitter} size="lg" className="gap-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white border-0">
                              <Twitter className="h-4 w-4" /> Share on Twitter
                            </Button>
                            <Button variant="outline" size="lg" onClick={handleCopy} className="gap-2 rounded-xl">
                              <Copy className="h-4 w-4" /> Copy Itinerary
                            </Button>
                          </div>
                          <div className="h-px bg-border mb-8 max-w-xs mx-auto" />
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button variant="hero" size="lg" className="gap-2 rounded-xl" onClick={() => window.location.href = "/create-trip"}>
                              <Plane className="h-4 w-4" /> Create Trip from This Plan
                            </Button>
                            <Button variant="outline" size="lg" onClick={handleReset} className="gap-2 rounded-xl">
                              <RotateCcw className="h-4 w-4" /> Plan Another Trip
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Social proof */}
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="rounded-2xl border border-border bg-card/50 p-6 text-center">
                        <div className="flex items-center justify-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground italic max-w-lg mx-auto">
                          "This AI Planner saved us 10+ hours of research for our Goa trip. The hidden gem recommendations were spot-on!"
                        </p>
                        <p className="mt-2 text-xs font-semibold text-foreground">— Priya & Friends, Goa Trip 2025</p>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Sticky Floating Refine Bar ─── */}
      <AnimatePresence>
        {generationDone && result && !loading && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-card/95 backdrop-blur-2xl shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.15)]"
          >
            <div className="container-max px-4 py-3">
              <div className="mx-auto max-w-4xl flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 flex-shrink-0">
                  <Wand2 className="h-4 w-4 text-secondary" />
                </div>
                <Input
                  placeholder="Modify your plan... (e.g., 'Add more food spots on Day 2')"
                  value={refineInput}
                  onChange={(e) => setRefineInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && refineInput) handleRefine(); }}
                  className="h-10 rounded-xl bg-background text-sm flex-1"
                />
                <Button
                  onClick={handleRefine}
                  disabled={!refineInput || loading}
                  size="sm"
                  className="rounded-xl gap-1.5 px-4 flex-shrink-0"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Refine
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default AIPlanner;
