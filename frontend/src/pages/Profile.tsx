import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Star, Edit3, Phone, Mail, CheckCircle, Camera,
  Shield, Calendar, Compass, Globe, Sparkles,
  Heart, X, Crown, Navigation, Plane
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TripCard from "@/components/TripCard";
import tripService from "@/services/tripService";
import authService from "@/services/authService";

/* ── animation variants ─────────────────────────────────────────────── */
const fadeUp = { 
  hidden: { opacity: 0, y: 30 }, 
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }) 
};
const scaleIn = { 
  hidden: { opacity: 0, scale: 0.95 }, 
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  } 
};

const interestOptions = [
  { label: "Beach", emoji: "🏖️" }, { label: "Culture", emoji: "🏛️" },
  { label: "Hiking", emoji: "🥾" }, { label: "Food", emoji: "🍜" },
  { label: "Photography", emoji: "📸" }, { label: "Nightlife", emoji: "🌃" },
  { label: "Shopping", emoji: "🛍️" }, { label: "Surfing", emoji: "🏄" },
  { label: "Camping", emoji: "⛺" }, { label: "History", emoji: "📜" },
  { label: "Wildlife", emoji: "🦁" }, { label: "Diving", emoji: "🤿" },
];

/* ── stat card sub-component ────────────────────────────────────────── */
const StatCard = ({ icon: Icon, value, label, delay }: { icon: any; value: string | number; label: string; delay: number }) => (
  <motion.div custom={delay} variants={fadeUp} initial="hidden" animate="visible"
    className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Icon className="h-6 w-6" strokeWidth={1.5} />
    </div>
    <span className="text-3xl font-bold text-foreground">{value}</span>
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
  </motion.div>
);

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const isOwnProfile = !userId || userId === user?._id;

  useEffect(() => {
    if (isOwnProfile && user) {
      setProfile({ ...user });
      setLoading(false);
      loadTrips();
    } else if (userId) {
      // Future: fetch user profile by ID if we implement public profiles
      setProfile(user); // Fallback for now
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [userId, user]);

  const loadTrips = async () => {
    try {
      const myTrips = await tripService.getMyTrips();
      setTrips(myTrips);
    } catch (error) {
      console.error("Failed to load trips:", error);
    }
  };

  const handleSave = async () => {
    if (!profile || !user) return;
    setSaving(true);
    try {
      await authService.updateProfile(profile);
      toast({ title: "Profile updated! ✨", description: "Your details have been saved successfully." });
      setEditing(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to update profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = () => {
    toast({ title: "Coming Soon", description: "Avatar upload is currently under maintenance." });
  };

  /* ── loading state ─────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        </div>
      </div>
    );
  }

  /* ── no profile / not logged in ────────────────────────────────────── */
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-10 w-10 text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="mb-3 text-3xl font-bold text-foreground">Sign In Required</h2>
          <p className="mb-8 max-w-md text-muted-foreground">Please log in to view your profile, manage your trips, and connect with other travelers.</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/")}>Return Home</Button>
            <Button onClick={() => navigate("/login")}>Log In</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const initials = profile.name
    ? profile.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Recently";

  const interests = profile.preferences?.interests || [];

  /* ── main render ───────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Header Area */}
      <div className="bg-muted/50 border-b pt-24 pb-32">
        <div className="container-max px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Your Profile</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Manage your travel preferences, view your past adventures, and plan your next journey.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container-max px-4 pb-24 -mt-20 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] items-start">

          {/* LEFT: Profile Card */}
          <motion.div variants={scaleIn} initial="hidden" animate="visible" className="relative">
            <div className="rounded-3xl border bg-card p-8 shadow-sm text-center">
              
              <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="h-full w-full rounded-full object-cover ring-4 ring-background" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary ring-4 ring-background">
                    {initials}
                  </div>
                )}
                
                {isOwnProfile && (
                  <button onClick={handleAvatarUpload} className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground border-4 border-background hover:scale-105 transition-transform shadow-sm">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-1">{profile.name || "Traveler"}</h2>
              {profile.location && (
                <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {profile.location}
                </p>
              )}

              <div className="my-6 flex flex-col gap-2">
                {profile.isEmailVerified && (
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Verified Identity</span>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 rounded-lg bg-muted px-3 py-2 text-foreground">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">{profile.role || "Member"}</span>
                </div>
              </div>

              {profile.bio && (
                <p className="mb-8 text-sm leading-relaxed text-muted-foreground italic">"{profile.bio}"</p>
              )}

              {isOwnProfile && (
                <Button
                  variant={editing ? "default" : "outline"}
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  disabled={saving}
                  className="w-full h-12"
                >
                  {saving ? (
                    <><div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" /> Saving...</>
                  ) : editing ? (
                    <>Save Changes</>
                  ) : (
                    <><Edit3 className="h-4 w-4 mr-2" /> Edit Profile</>
                  )}
                </Button>
              )}
            </div>
          </motion.div>

          {/* RIGHT: Content Area */}
          <div className="space-y-8">
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon={Plane} value={trips.length} label="Trips Planned" delay={1} />
              <StatCard icon={Star} value={Number(profile.rating || 0).toFixed(1)} label="Rating" delay={2} />
              <StatCard icon={Calendar} value={memberSince} label="Joined" delay={3} />
            </div>

            <AnimatePresence mode="wait">
              {editing ? (
                /* EDIT MODE */
                <motion.div key="edit" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 rounded-3xl border bg-card p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Edit Profile</h2>
                      <p className="text-sm text-muted-foreground mt-1">Update your personal details and preferences.</p>
                    </div>
                    <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Full Name</label>
                      <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="h-12 bg-background" placeholder="Your full name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Location</label>
                      <Input value={profile.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="h-12 bg-background" placeholder="City, Country" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Bio</label>
                    <Textarea value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="min-h-[120px] bg-background resize-none" placeholder="Tell other travelers about yourself..." />
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Travel Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map(({ label, emoji }) => {
                        const selected = profile.preferences?.interests?.includes(label);
                        return (
                          <button key={label}
                            onClick={() => {
                              const current = profile.preferences?.interests || [];
                              setProfile({
                                ...profile,
                                preferences: {
                                  ...profile.preferences,
                                  interests: selected
                                    ? current.filter((i: string) => i !== label)
                                    : [...current, label],
                                },
                              });
                            }}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
                              selected
                                ? "bg-primary text-primary-foreground font-medium"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            <span>{emoji}</span> {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* VIEW MODE */
                <motion.div key="view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                  
                  {/* Interests */}
                  {interests.length > 0 && (
                    <div className="rounded-3xl border bg-card p-6 md:p-8 shadow-sm">
                      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" /> Travel Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest: string) => {
                          const opt = interestOptions.find((o) => o.label === interest);
                          return (
                            <div key={interest} className="flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground">
                              <span>{opt?.emoji || "✨"}</span> {interest}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Trips List */}
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <Navigation className="h-6 w-6 text-primary" /> 
                      {isOwnProfile ? "Your Trips" : `${profile.name}'s Trips`}
                    </h3>

                    {trips.length > 0 ? (
                      <div className="grid gap-6 sm:grid-cols-2">
                        {trips.map((trip, i) => (
                          <TripCard key={trip._id} trip={trip} index={i} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/30 p-12 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                          <Compass className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-2">No trips planned yet</h4>
                        <p className="text-muted-foreground max-w-sm mb-6">Looks like the map is blank. Start planning your first adventure to see it here.</p>
                        <div className="flex gap-4">
                          <Button onClick={() => navigate("/ai-planner")}>Plan a Trip</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
