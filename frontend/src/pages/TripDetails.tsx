import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, Users, Star, ArrowLeft, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import tripService, { Trip } from "@/services/tripService";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [expenses] = useState<any[]>([]);
  const [messages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [joined, setJoined] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showItineraryForm, setShowItineraryForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: "", amount: "", category: "General" });
  const [newItem, setNewItem] = useState({ day: "1", title: "", location: "", time: "", notes: "" });

  useEffect(() => {
    if (id) loadTrip();
  }, [id, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadTrip = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const tripData = await tripService.getTrip(id);
      setTrip(tripData);
      setItinerary(tripData.itinerary || []);

      // Mocking member list for now
      const mockMembers = [{ user: tripData.organizer, role: "organizer", status: "approved" }];
      setMembers(mockMembers);
      
      if (user?._id === tripData.organizer._id) {
        setIsMember(true);
      }
    } catch (error) {
      console.error("Failed to load trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTrip = async () => {
    if (!user) { navigate("/login"); return; }
    if (!id) return;
    try {
      await tripService.joinTrip(id);
      setJoined(true);
      toast({ title: "Request Sent! 🎉", description: "Your request has been sent to the organizer." });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to join", variant: "destructive" });
    }
  };

  const handleSendMessage = () => {
    toast({ title: "Coming Soon", description: "Chat is being migrated to the new backend." });
    setNewMessage("");
  };

  const handleAddExpense = () => {
    toast({ title: "Coming Soon", description: "Expenses are being migrated to the new backend." });
    setShowExpenseForm(false);
  };

  const handleAddItineraryItem = () => {
    toast({ title: "Coming Soon", description: "Itinerary editing is coming soon." });
    setShowItineraryForm(false);
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

  if (!trip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Trip not found</h1>
          <Link to="/explore"><Button>Back to Explore</Button></Link>
        </div>
      </div>
    );
  }

  const spotsLeft = (trip.maxMembers || 8) - (trip.currentMembersCount || 1);
  const isOrganizer = user?._id === trip.organizer._id;

  const itineraryByDay = itinerary.reduce<Record<number, any[]>>((acc, item) => {
    const day = item.day || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={trip.images?.[0] || "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80"}
          alt={trip.destination}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="container-max absolute bottom-0 left-0 right-0 px-4 pb-10">
          <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {trip.category && <Badge className="mb-3 border-0 bg-white/20 text-white backdrop-blur-md">{trip.category}</Badge>}
          <h1 className="mb-2 text-3xl font-bold text-white md:text-5xl lg:text-6xl tracking-tight">{trip.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {trip.destination}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> ${trip.budget}</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {trip.currentMembersCount}/{trip.maxMembers}</span>
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6 w-full justify-start rounded-xl bg-muted p-1">
                <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                <TabsTrigger value="itinerary" className="rounded-lg">Itinerary</TabsTrigger>
                <TabsTrigger value="chat" className="rounded-lg">Chat</TabsTrigger>
                <TabsTrigger value="expenses" className="rounded-lg">Expenses</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="mb-3 text-xl font-semibold text-foreground">About This Trip</h2>
                    <p className="leading-relaxed text-muted-foreground">{trip.description}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">Members ({members.length})</h2>
                    <div className="space-y-3">
                      {members.map((m, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-accent text-xs font-bold text-white">
                            {m.user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{m.user?.name || "Anonymous"}</p>
                            <p className="text-xs text-muted-foreground capitalize">{m.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="itinerary">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Trip Itinerary</h2>
                    {(isMember || isOrganizer) && (
                      <Button size="sm" onClick={() => setShowItineraryForm(!showItineraryForm)} className="gap-1">
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    )}
                  </div>
                  {showItineraryForm && (
                     <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                        <Input placeholder="Activity title" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                        <Button onClick={handleAddItineraryItem}>Mock Add</Button>
                     </div>
                  )}
                  {Object.keys(itineraryByDay).length > 0 ? (
                    Object.entries(itineraryByDay).map(([day, items]) => (
                      <div key={day} className="rounded-2xl border border-border bg-card p-6">
                        <h3 className="mb-4 text-lg font-semibold text-foreground">Day {day}</h3>
                        <div className="space-y-4">
                          {items.map((item: any, i: number) => (
                            <div key={i} className="flex gap-4 border-l-2 border-secondary pl-4">
                              <div>
                                <h4 className="font-medium text-foreground">{item.title}</h4>
                                {item.location && <p className="text-sm text-muted-foreground">{item.location}</p>}
                                {item.time && <p className="text-xs text-secondary">{item.time}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
                      <p className="text-muted-foreground">No itinerary items yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="chat">
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="h-[400px] flex items-center justify-center p-4">
                    <p className="text-muted-foreground text-center">Chat is being migrated. <br/> Check back soon!</p>
                  </div>
                  {(isMember || isOrganizer) && (
                    <div className="border-t border-border p-4 flex gap-2">
                       <Input placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                       <Button onClick={handleSendMessage} size="icon"><Send className="h-4 w-4"/></Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="expenses">
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-foreground">Expenses</h2>
                      {(isMember || isOrganizer) && (
                        <Button size="sm" onClick={() => setShowExpenseForm(!showExpenseForm)}> <Plus className="h-4 w-4 mr-1"/> Add</Button>
                      )}
                   </div>
                   {showExpenseForm && (
                      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                         <Input placeholder="Title" value={newExpense.title} onChange={e => setNewExpense({...newExpense, title: e.target.value})} />
                         <Input type="number" placeholder="Amount" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
                         <Button onClick={handleAddExpense}>Mock Add</Button>
                      </div>
                   )}
                   <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
                      <p className="text-muted-foreground">Expense tracking is coming soon.</p>
                   </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-accent text-xs font-bold text-white">
                    {trip.organizer?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{trip.organizer?.name || "Organizer"}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                       <Star className="h-3 w-3 fill-secondary text-secondary" /> {Number(trip.organizer?.rating || 0).toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="mb-4 text-sm text-muted-foreground">
                  <p>{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining</p>
                </div>
                {isOrganizer ? (
                  <Badge className="w-full justify-center border-0 bg-gradient-primary py-2 text-primary-foreground">You're the organizer</Badge>
                ) : isMember ? (
                  <Badge className="w-full justify-center border-0 bg-secondary py-2 text-secondary-foreground">You're a member ✓</Badge>
                ) : joined ? (
                  <Badge variant="outline" className="w-full justify-center py-2">Request pending...</Badge>
                ) : (
                  <Button variant="hero" className="w-full" onClick={handleJoinTrip} disabled={spotsLeft <= 0}>
                    {spotsLeft <= 0 ? "Trip Full" : "Request to Join"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TripDetails;
