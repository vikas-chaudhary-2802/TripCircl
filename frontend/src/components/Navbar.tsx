import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, LogOut, Map, Compass, Brain, Globe } from "lucide-react";
import tripcirclLogo from "@/assets/tripcircl-logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { to: "/ai-planner", label: "AI Planner", icon: Compass, badge: true },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const useSolid = scrolled || !isHome;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-3 py-3 md:px-6"
    >
      <div className="container-max">
        <motion.div
          animate={{
            backgroundColor: useSolid ? "hsl(var(--card) / 0.92)" : "rgba(255,255,255,0.04)",
            borderColor: useSolid ? "hsl(var(--border) / 0.6)" : "rgba(255,255,255,0.08)",
            boxShadow: useSolid
              ? "0 8px 40px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(255,255,255,0.04) inset"
              : "none",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center justify-between rounded-2xl border px-5 py-2.5 backdrop-blur-2xl"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-secondary/20"
            >
              <img src={tripcirclLogo} alt="TripCircl" className="h-9 w-9 object-contain relative z-10" />
            </motion.div>
            <span className={`text-lg font-bold tracking-tight leading-none transition-colors duration-300 ${
              useSolid ? "text-foreground" : "text-white"
            }`}>
              Trip<span className="text-secondary">Circl</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to}>
                  <motion.div
                    whileHover={{ y: -1 }}
                    className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? useSolid
                          ? "bg-secondary/10 text-secondary"
                          : "bg-white/12 text-white"
                        : useSolid
                          ? "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          : "text-white/65 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {link.label}

                    {link.badge && (
                      <span className="relative flex h-2 w-2 ml-0.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className={`absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full ${
                          useSolid ? "bg-secondary" : "bg-white"
                        }`}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden md:flex items-center gap-1">
                <Link to="/messages">
                  <motion.div
                    whileHover={{ y: -1 }}
                    className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                      useSolid ? "hover:bg-muted/60 text-muted-foreground hover:text-foreground" : "hover:bg-white/8 text-white/60 hover:text-white"
                    }`}
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                  </motion.div>
                </Link>
                <Link to="/profile">
                  <motion.div
                    whileHover={{ y: -1 }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/90 to-accent/90 text-white text-[11px] font-bold shadow-sm"
                  >
                    {initials}
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={signOut}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                    useSolid ? "hover:bg-destructive/8 text-muted-foreground/60 hover:text-destructive" : "hover:bg-white/8 text-white/40 hover:text-white/80"
                  }`}
                >
                  <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />
                </motion.button>
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden md:block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      useSolid ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"
                    }`}
                  >
                    Log In
                  </motion.button>
                </Link>
                <Link to="/signup" className="hidden md:block">
                  <Button variant="default" size="sm" className="rounded-xl bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-white shadow-lg shadow-secondary/20 border-0 px-5 font-semibold">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                useSolid ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"
              }`}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 overflow-hidden rounded-2xl border border-border/50 bg-card/98 shadow-xl backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-0.5 p-3">
                {navLinks.map((link, i) => (
                  <motion.div key={link.to} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                    <Link to={link.to} onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                        location.pathname === link.to ? "bg-secondary/10 text-secondary" : "text-foreground hover:bg-muted"
                      }`}>
                      <link.icon className="h-4 w-4 text-muted-foreground" />
                      {link.label}

                      {link.badge && (
                        <span className="ml-auto relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
                <div className="my-1.5 h-px bg-border/50" />
                {user ? (
                  <>
                    <Link to="/messages" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" /> Messages
                    </Link>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent text-[10px] font-bold text-white">{initials}</div>
                      Profile
                    </Link>
                    <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-destructive hover:bg-destructive/5">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-2 pt-1">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl">Log In</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button className="w-full rounded-xl bg-gradient-to-r from-secondary to-accent border-0 text-white shadow-md">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
