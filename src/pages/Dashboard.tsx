import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Calendar, MessageCircle, Users, ArrowRight, Plus, Star, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TripCard from "@/components/TripCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [myTrips, setMyTrips] = useState<any[]>([]);
  const [suggestedTrips, setSuggestedTrips] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    // My trips
    const { data: memberships } = await supabase
      .from("trip_members")
      .select("trip_id, trips(*, profiles!trips_organizer_id_fkey(name, avatar_url, rating))")
      .eq("user_id", user.id)
      .eq("status", "approved");
    if (memberships) setMyTrips(memberships.map((m: any) => m.trips).filter(Boolean));

    // Suggested trips (ones I'm not part of)
    const { data: allTrips } = await supabase
      .from("trips")
      .select("*, profiles!trips_organizer_id_fkey(name, avatar_url, rating)")
      .eq("status", "active")
      .neq("organizer_id", user.id)
      .limit(6);
    if (allTrips) {
      const myTripIds = memberships?.map((m: any) => m.trip_id) || [];
      setSuggestedTrips(allTrips.filter((t) => !myTripIds.includes(t.id)));
    }

    // Pending invites (trips where I'm pending)
    const { count: pending } = await supabase
      .from("trip_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "pending");
    setPendingInvites(pending || 0);

    setLoading(false);
  };

  if (!user) return null;

  const firstName = profile?.name?.split(" ")[0] || "Traveler";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-max px-4 pt-28 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
            Welcome back, <span className="font-serif italic text-gradient">{firstName}</span> 👋
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your trips.</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Your Trips", value: String(myTrips.length), icon: Calendar, color: "bg-secondary/10 text-secondary" },
            { label: "Messages", value: "—", icon: MessageCircle, color: "bg-accent/10 text-accent" },
            { label: "Pending", value: String(pendingInvites), icon: Bell, color: "bg-destructive/10 text-destructive" },
            { label: "Trips Joined", value: String(profile?.trips_joined || myTrips.length), icon: MapPin, color: "bg-primary/10 text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10 flex flex-wrap gap-3">
          <Link to="/create-trip"><Button variant="hero" className="gap-2"><Plus className="h-4 w-4" /> Create New Trip</Button></Link>
          <Link to="/explore"><Button variant="outline" className="gap-2"><MapPin className="h-4 w-4" /> Explore Trips</Button></Link>
          <Link to="/messages"><Button variant="outline" className="gap-2"><MessageCircle className="h-4 w-4" /> Messages</Button></Link>
          <Link to="/profile"><Button variant="outline" className="gap-2"><Users className="h-4 w-4" /> Edit Profile</Button></Link>
        </motion.div>

        {/* My Trips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Trips</h2>
            <Link to="/explore" className="flex items-center gap-1 text-sm font-medium text-secondary hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
            </div>
          ) : myTrips.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myTrips.map((trip, i) => (
                <TripCard key={trip.id} trip={trip} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
              <p className="text-muted-foreground">No trips yet. Create or join one to get started!</p>
            </div>
          )}
        </motion.div>

        {/* Suggested */}
        {suggestedTrips.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Recommended for You</h2>
              <Link to="/explore" className="flex items-center gap-1 text-sm font-medium text-secondary hover:underline">
                See More <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestedTrips.slice(0, 3).map((trip, i) => (
                <TripCard key={trip.id} trip={trip} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
