import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Edit3, Phone, Mail, CheckCircle, Camera, Shield, Languages } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TripCard from "@/components/TripCard";
import { TRAVEL_STYLES } from "@/lib/mock-data";
import tripService from "@/services/tripService";
import authService from "@/services/authService";

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, login } = useAuth(); // login to update local state
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<any[]>([]);
  const [ratings] = useState<any[]>([]);

  const isOwnProfile = !userId || userId === user?._id;

  useEffect(() => {
    if (isOwnProfile && user) {
        setProfile({...user});
        setLoading(false);
        loadTrips();
    } else {
        // Fetching other users not yet fully implemented in generic tripService
        // We'll just show current user for now as a fallback
        setProfile(user);
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
    try {
      const updatedUser = await authService.updateProfile(profile);
      // Hacky way to update local context (optional but good)
      // refreshProfile logic would be better
      toast({ title: "Profile updated! ✅", description: "Your changes have been saved." });
      setEditing(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to update profile", variant: "destructive" });
    }
  };

  const handleAvatarUpload = () => {
    toast({ title: "Coming Soon", description: "Avatar upload is being migrated to the new backend." });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-40">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40 gap-4">
          <p className="text-lg text-muted-foreground">Profile not found</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const initials = profile.name
    ? profile.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const interestOptions = ["Beach", "Culture", "Hiking", "Food", "Photography", "Nightlife", "Shopping", "Surfing", "Camping", "History", "Wildlife", "Diving"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-max px-4 pt-28 pb-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="relative mx-auto mb-4">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="h-24 w-24 rounded-full object-cover mx-auto" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary text-2xl font-bold text-primary-foreground mx-auto">
                    {initials}
                  </div>
                )}
                {isOwnProfile && (
                  <label onClick={handleAvatarUpload} className="absolute bottom-0 right-1/2 translate-x-[3rem] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md">
                    <Camera className="h-4 w-4" />
                  </label>
                )}
              </div>

              <h2 className="mb-1 text-xl font-bold text-foreground">{profile.name || "Anonymous"}</h2>
              {profile.location && (
                <p className="mb-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </p>
              )}

              <div className="mb-4 flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm font-medium text-foreground">{Number(profile.rating || 0).toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">· {trips.length} trips</span>
              </div>

              <div className="mb-4 flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="gap-1 text-xs">
                  <Mail className="h-3 w-3" /> Email
                </Badge>
                {profile.phone && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Phone className="h-3 w-3" /> Phone
                  </Badge>
                )}
              </div>

              {profile.bio && <p className="mb-4 text-sm text-muted-foreground">{profile.bio}</p>}

              {isOwnProfile && (
                <Button
                  variant={editing ? "default" : "outline"}
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  className="w-full gap-2"
                >
                  {editing ? <><CheckCircle className="h-4 w-4" /> Save Changes</> : <><Edit3 className="h-4 w-4" /> Edit Profile</>}
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            {editing ? (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                <h2 className="text-xl font-semibold text-foreground">Edit Profile</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Name</label>
                    <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="h-12" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Location</label>
                    <Input value={profile.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="h-12" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Bio</label>
                  <Textarea value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="min-h-[100px]" placeholder="Tell other travelers about yourself..." />
                </div>

                <div>
                   <label className="mb-3 block text-sm font-medium text-foreground">Travel Preferences</label>
                   <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => {
                      const selected = profile.preferences?.interests?.includes(interest);
                      return (
                        <button
                          key={interest}
                          onClick={() => {
                            const current = profile.preferences?.interests || [];
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                interests: selected
                                  ? current.filter((i: string) => i !== interest)
                                  : [...current, interest],
                              }
                            });
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                            selected
                              ? "bg-accent text-accent-foreground shadow-md"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="mb-6 text-xl font-semibold text-foreground">
                  {isOwnProfile ? "Your Trips" : `${profile.name}'s Trips`}
                </h2>
                {trips.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {trips.map((trip, i) => (
                      <TripCard key={trip._id} trip={trip} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
                    <p className="text-muted-foreground">No trips yet. Start by exploring or creating a trip!</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate("/explore")}>
                      Explore Trips
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
