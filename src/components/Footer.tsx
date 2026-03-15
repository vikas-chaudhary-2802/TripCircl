import { Link } from "react-router-dom";
import { Heart, Instagram, Twitter, Youtube, ArrowUpRight, Compass } from "lucide-react";
import { motion } from "framer-motion";
import tripcirclLogo from "@/assets/tripcircl-logo.png";

const footerLinks = {
  Product: [
    { label: "AI Planner", to: "/ai-planner" },
    { label: "Discover Trips", to: "/explore" },
    { label: "Create a Trip", to: "/create-trip" },
    { label: "My Dashboard", to: "/dashboard" },
  ],
  Company: [
    { label: "About Us", to: "/" },
    { label: "Blog", to: "/" },
    { label: "Careers", to: "/" },
    { label: "Contact", to: "/" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/" },
    { label: "Terms of Service", to: "/" },
    { label: "Cookie Policy", to: "/" },
  ],
};

const Footer = () => (
  <footer className="relative border-t border-border/50 bg-card/30 px-4 pt-20 pb-10 md:px-8 overflow-hidden">
    {/* Subtle gradient glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-gradient-to-b from-secondary/4 to-transparent blur-3xl pointer-events-none" />
    {/* Grid pattern */}
    <div className="absolute inset-0 opacity-[0.015]" style={{
      backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)`,
      backgroundSize: "48px 48px"
    }} />

    <div className="container-max relative">
      <div className="grid gap-12 md:grid-cols-5">
        {/* Brand */}
        <div className="md:col-span-2">
          <Link to="/" className="mb-5 inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-secondary/15">
              <img src={tripcirclLogo} alt="TripCircl" className="h-10 w-10 object-contain" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Trip<span className="text-secondary">Circl</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground/70">
            India's premium group travel platform. Find your tribe, plan together, explore everywhere.
          </p>
          <div className="mt-6 flex gap-2.5">
            {[
              { icon: Instagram, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Youtube, href: "#" },
            ].map(({ icon: Icon, href }, i) => (
              <motion.a
                key={i}
                href={href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-muted/30 text-muted-foreground/60 transition-all duration-300 hover:border-secondary/20 hover:text-secondary hover:bg-secondary/5 hover:shadow-md"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category}>
            <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/60">{category}</h4>
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="group flex items-center gap-1 text-sm text-muted-foreground/60 transition-colors hover:text-foreground"
                >
                  {link.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all group-hover:opacity-60 group-hover:translate-y-0 group-hover:translate-x-0" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-16 border-t border-border/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground/50">
          Made with <Heart className="h-3.5 w-3.5 fill-destructive/70 text-destructive/70" /> in India
        </p>
        <p className="text-xs text-muted-foreground/35">© 2026 TripCircl. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
