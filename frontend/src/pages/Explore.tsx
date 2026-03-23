import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TripCard from "@/components/TripCard";
import { TRAVEL_STYLES } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";

const Explore = () => {
  const [search, setSearch] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "budget" | "spots">("date");
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    const { data } = await supabase
      .from("trips")
      .select("*, profiles!trips_organizer_id_fkey(name, avatar_url, rating)")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (data) setTrips(data);
    setLoading(false);
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const filteredTrips = useMemo(() => {
    const filtered = trips.filter((trip) => {
      const matchSearch =
        !search ||
        trip.destination.toLowerCase().includes(search.toLowerCase()) ||
        trip.title.toLowerCase().includes(search.toLowerCase()) ||
        trip.country.toLowerCase().includes(search.toLowerCase());
      const matchStyle =
        selectedStyles.length === 0 || selectedStyles.includes(trip.travel_style);
      return matchSearch && matchStyle;
    });

    if (sortBy === "date") filtered.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    if (sortBy === "budget") filtered.sort((a, b) => (a.budget_min || 0) - (b.budget_min || 0));
    if (sortBy === "spots") filtered.sort((a, b) => ((a.max_group_size || 8) - (a.current_members || 1)) - ((b.max_group_size || 8) - (b.current_members || 1)));

    return filtered;
  }, [search, selectedStyles, sortBy, trips]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-max px-4 pt-28 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <h1 className="mb-3 text-3xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Explore <span className="font-serif italic text-gradient">Trips</span>
          </h1>
          <p className="text-lg text-muted-foreground">Discover group travel experiences and find your next adventure.</p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by destination, country, or trip name..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-12 rounded-xl border-border bg-card pl-12 text-foreground shadow-sm" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button variant={showFilters ? "default" : "outline"} onClick={() => setShowFilters(!showFilters)} className="h-12 gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {selectedStyles.length > 0 && <Badge className="ml-1 border-0 bg-secondary text-secondary-foreground">{selectedStyles.length}</Badge>}
            </Button>
          </div>

          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 rounded-2xl border border-border bg-card p-6">
              <div className="mb-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Travel Style</h3>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_STYLES.map((style) => (
                    <button key={style} onClick={() => toggleStyle(style)} className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${selectedStyles.includes(style) ? "bg-secondary text-secondary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Sort By</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "date" as const, label: "Departure Date" },
                    { value: "budget" as const, label: "Budget (Low to High)" },
                    { value: "spots" as const, label: "Spots Available" },
                  ].map((option) => (
                    <button key={option.value} onClick={() => setSortBy(option.value)} className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${sortBy === option.value ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              {selectedStyles.length > 0 && (
                <button onClick={() => setSelectedStyles([])} className="mt-4 text-sm font-medium text-secondary hover:underline">
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        <p className="mb-6 text-sm text-muted-foreground">
          {filteredTrips.length} trip{filteredTrips.length !== 1 ? "s" : ""} found
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.map((trip, index) => (
              <TripCard key={trip.id} trip={trip} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-foreground">No trips found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
