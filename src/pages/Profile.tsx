import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Edit3, Phone, Mail, CheckCircle, Camera, Shield, Globe, Languages, Calendar, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TripCard from "@/components/TripCard";
import { TRAVEL_STYLES } from "@/lib/mock-data";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile: authProfile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);

  const isOwnProfile = !userId || userId === user?.id;

  useEffect(() => {
    const targetId = userId || user?.id;
    if (!targetId) {
      if (!userId) navigate("/login");
      return;
    }
    loadProfile(targetId);
    loadTrips(targetId);
    loadRatings(targetId);
  }, [userId, user]);

  const loadProfile = async (uid: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", uid).single();
    if (data) setProfile(data);
    setLoading(false);
  };

  const loadTrips = async (uid: string) => {
    const { data } = await supabase
      .from("trip_members")
      .select("trip_id, trips(*)")
      .eq("user_id", uid)
      .eq("status", "approved");
    if (data) setTrips(data.map((d: any) => d.trips).filter(Boolean));
  };

  const loadRatings = async (uid: string) => {
    const { data } = await supabase
      .from("ratings")
      .select("*, profiles!ratings_reviewer_id_fkey(name, avatar_url)")
      .eq("reviewee_id", uid);
    if (data) setRatings(data);
  };

  const handleSave = async () => {
    if (!profile || !user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
        age: profile.age,
        phone: profile.phone,
        languages: profile.languages,
        travel_interests: profile.travel_interests,
        travel_style: profile.travel_style,
        budget_range: profile.budget_range,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setEditing(false);
      refreshProfile();
      toast({ title: "Profile updated! ✅", description: "Your changes have been saved." });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", user.id);
    setProfile((p) => p ? { ...p, avatar_url: publicUrl } : p);
    refreshProfile();
    toast({ title: "Avatar updated! 📸" });
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
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const interestOptions = ["Beach", "Culture", "Hiking", "Food", "Photography", "Nightlife", "Shopping", "Surfing", "Camping", "History", "Wildlife", "Diving"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-max px-4 pt-28 pb-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              {/* Avatar */}
              <div className="relative mx-auto mb-4">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name} className="h-24 w-24 rounded-full object-cover mx-auto" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary text-2xl font-bold text-primary-foreground mx-auto">
                    {initials}
                  </div>
                )}
                {isOwnProfile && (
                  <label className="absolute bottom-0 right-1/2 translate-x-[3rem] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
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
                <span className="text-sm font-medium text-foreground">{Number(profile.rating).toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">· {profile.trips_joined} trips</span>
              </div>

              {/* Verification badges */}
              <div className="mb-4 flex flex-wrap justify-center gap-2">
                {profile.email_verified && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Mail className="h-3 w-3" /> Email
                  </Badge>
                )}
                {profile.phone_verified && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Phone className="h-3 w-3" /> Phone
                  </Badge>
                )}
                {profile.id_verified && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Shield className="h-3 w-3" /> ID Verified
                  </Badge>
                )}
              </div>

              {profile.bio && <p className="mb-4 text-sm text-muted-foreground">{profile.bio}</p>}

              {profile.languages && profile.languages.length > 0 && (
                <div className="mb-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Languages className="h-3.5 w-3.5" />
                  {profile.languages.join(", ")}
                </div>
              )}

              {profile.travel_interests && profile.travel_interests.length > 0 && (
                <div className="mb-4 flex flex-wrap justify-center gap-1.5">
                  {profile.travel_interests.map((interest) => (
                    <span key={interest} className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                      {interest}
                    </span>
                  ))}
                </div>
              )}

              {profile.travel_style && (
                <Badge className="mb-4 border-0 bg-gradient-primary text-primary-foreground">
                  {profile.travel_style}
                </Badge>
              )}

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

            {/* Ratings */}
            {ratings.length > 0 && (
              <div className="mt-6 rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Reviews</h3>
                <div className="space-y-4">
                  {ratings.slice(0, 5).map((r) => (
                    <div key={r.id} className="border-b border-border pb-3 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < Math.round(((r.safety || 0) + (r.communication || 0) + (r.reliability || 0)) / 3) ? "fill-secondary text-secondary" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Edit Form / Trip History */}
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Age</label>
                    <Input type="number" value={profile.age || ""} onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || null })} className="h-12" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Phone</label>
                    <Input value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="h-12" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Bio</label>
                  <Textarea value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="min-h-[100px]" placeholder="Tell other travelers about yourself..." />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Budget Range</label>
                  <Input value={profile.budget_range || ""} onChange={(e) => setProfile({ ...profile, budget_range: e.target.value })} className="h-12" placeholder="e.g., $1,000 - $3,000" />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-foreground">Travel Style</label>
                  <div className="flex flex-wrap gap-2">
                    {TRAVEL_STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => setProfile({ ...profile, travel_style: style as any })}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          profile.travel_style === style
                            ? "bg-secondary text-secondary-foreground shadow-md"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-foreground">Travel Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => {
                      const selected = profile.travel_interests?.includes(interest);
                      return (
                        <button
                          key={interest}
                          onClick={() => {
                            const current = profile.travel_interests || [];
                            setProfile({
                              ...profile,
                              travel_interests: selected
                                ? current.filter((i) => i !== interest)
                                : [...current, interest],
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Languages (comma separated)</label>
                  <Input
                    value={(profile.languages || []).join(", ")}
                    onChange={(e) => setProfile({ ...profile, languages: e.target.value.split(",").map((l) => l.trim()).filter(Boolean) })}
                    className="h-12"
                    placeholder="English, Spanish, Japanese"
                  />
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
                      <TripCard key={trip.id} trip={trip} index={i} />
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
