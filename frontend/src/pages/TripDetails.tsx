import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, Users, Star, ArrowLeft, Send, Plus, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const [trip, setTrip] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [joined, setJoined] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);


  // Forms

  // Forms
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showItineraryForm, setShowItineraryForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: "", amount: "", category: "General" });
  const [newItem, setNewItem] = useState({ day: "1", title: "", location: "", time: "", notes: "" });

  useEffect(() => {
    if (id) loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Realtime messages
  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        async (payload) => {
          const { data: senderProfile } = await supabase.from("profiles").select("name, avatar_url").eq("user_id", payload.new.sender_id).single();
          setMessages((prev) => [...prev, { ...payload.new, profiles: senderProfile }]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  const loadTrip = async () => {
    const { data: tripData } = await supabase.from("trips").select("*, profiles!trips_organizer_id_fkey(name, avatar_url, rating)").eq("id", id).single();
    if (!tripData) { setLoading(false); return; }
    setTrip(tripData);

    // Members
    const { data: membersData } = await supabase.from("trip_members").select("*, profiles!trip_members_user_id_fkey(name, avatar_url, rating)").eq("trip_id", id);
    if (membersData) {
      setMembers(membersData);
      if (user) setIsMember(membersData.some((m) => m.user_id === user.id && m.status === "approved"));
    }

    // Itinerary
    const { data: itin } = await supabase.from("itinerary_items").select("*").eq("trip_id", id).order("day").order("time");
    if (itin) setItinerary(itin);

    // Expenses
    const { data: exp } = await supabase.from("expenses").select("*, profiles:profiles!expenses_paid_by_fkey(name)").eq("trip_id", id);
    if (exp) setExpenses(exp);

    // Conversation
    const { data: conv } = await supabase.from("conversations").select("id").eq("trip_id", id).eq("type", "group").single();
    if (conv) {
      setConversationId(conv.id);
      const { data: msgs } = await supabase.from("messages").select("*, profiles:profiles!messages_sender_id_fkey(name, avatar_url)").eq("conversation_id", conv.id).order("created_at");
      if (msgs) setMessages(msgs);
    }

    setLoading(false);
  };

  const handleJoinTrip = async () => {
    if (!user) { navigate("/login"); return; }
    const { error } = await supabase.from("trip_members").insert({ trip_id: id!, user_id: user.id, role: "member", status: "pending" });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setJoined(true);
      toast({ title: "Request Sent! 🎉", description: "Your request has been sent to the organizer." });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !conversationId) return;
    await supabase.from("messages").insert({ conversation_id: conversationId, sender_id: user.id, content: newMessage });
    setNewMessage("");
  };

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount || !user) return;
    const { error } = await supabase.from("expenses").insert({
      trip_id: id!,
      title: newExpense.title,
      amount: parseFloat(newExpense.amount),
      paid_by: user.id,
      split_among: members.filter((m) => m.status === "approved").map((m) => m.user_id),
      category: newExpense.category,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      setNewExpense({ title: "", amount: "", category: "General" });
      setShowExpenseForm(false);
      loadTrip();
      toast({ title: "Expense added ✅" });
    }
  };

  const handleAddItineraryItem = async () => {
    if (!newItem.title || !user) return;
    const { error } = await supabase.from("itinerary_items").insert({
      trip_id: id!,
      day: parseInt(newItem.day),
      title: newItem.title,
      location: newItem.location,
      time: newItem.time,
      notes: newItem.notes,
      created_by: user.id,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      setNewItem({ day: "1", title: "", location: "", time: "", notes: "" });
      setShowItineraryForm(false);
      loadTrip();
      toast({ title: "Itinerary updated ✅" });
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
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

  const spotsLeft = (trip.max_group_size || 8) - (trip.current_members || 1);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const approvedMembers = members.filter((m) => m.status === "approved");
  const perPerson = approvedMembers.length > 0 ? totalExpenses / approvedMembers.length : 0;
  const isOrganizer = user?.id === trip.organizer_id;

  const itineraryByDay = itinerary.reduce<Record<number, any[]>>((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={trip.image_url || "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80"}
          alt={trip.destination}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="container-max absolute bottom-0 left-0 right-0 px-4 pb-10">
          <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {trip.travel_style && <Badge className="mb-3 border-0 bg-white/20 text-white backdrop-blur-md">{trip.travel_style}</Badge>}
          <h1 className="mb-2 text-3xl font-bold text-white md:text-5xl lg:text-6xl tracking-tight">{trip.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {trip.destination}, {trip.country}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(trip.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(trip.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> ${trip.budget_min} - ${trip.budget_max}</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {trip.current_members}/{trip.max_group_size}</span>
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

              {/* Overview */}
              <TabsContent value="overview">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="mb-3 text-xl font-semibold text-foreground">About This Trip</h2>
                    <p className="leading-relaxed text-muted-foreground">{trip.description}</p>
                    {trip.tags?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {trip.tags.map((tag: string) => (
                          <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Members */}
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">Members ({approvedMembers.length})</h2>
                    <div className="space-y-3">
                      {approvedMembers.map((m) => (
                        <div key={m.id} className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-accent text-xs font-bold text-white">
                            {m.profiles?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{m.profiles?.name || "Anonymous"}</p>
                            <p className="text-xs text-muted-foreground capitalize">{m.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Itinerary */}
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
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Day</label>
                          <Input type="number" min="1" value={newItem.day} onChange={(e) => setNewItem({ ...newItem, day: e.target.value })} />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Time</label>
                          <Input type="time" value={newItem.time} onChange={(e) => setNewItem({ ...newItem, time: e.target.value })} />
                        </div>
                      </div>
                      <Input placeholder="Activity name" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} />
                      <Input placeholder="Location" value={newItem.location} onChange={(e) => setNewItem({ ...newItem, location: e.target.value })} />
                      <Input placeholder="Notes" value={newItem.notes} onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })} />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleAddItineraryItem} disabled={!newItem.title}>Add</Button>
                        <Button size="sm" variant="ghost" onClick={() => setShowItineraryForm(false)}>Cancel</Button>
                      </div>
                    </motion.div>
                  )}

                  {Object.keys(itineraryByDay).length > 0 ? (
                    Object.entries(itineraryByDay).map(([day, items]) => (
                      <div key={day} className="rounded-2xl border border-border bg-card p-6">
                        <h3 className="mb-4 text-lg font-semibold text-foreground">Day {day}</h3>
                        <div className="space-y-4">
                          {items.map((item: any) => (
                            <div key={item.id} className="flex gap-4 border-l-2 border-secondary pl-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  {item.time && <span className="text-xs font-medium text-secondary">{item.time}</span>}
                                  <h4 className="font-medium text-foreground">{item.title}</h4>
                                </div>
                                {item.location && <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" />{item.location}</p>}
                                {item.notes && <p className="mt-1 text-xs text-muted-foreground">{item.notes}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
                      <p className="text-muted-foreground">No itinerary items yet. Add activities or use AI Planner!</p>
                    </div>
                  )}
                </div>
              </TabsContent>


              {/* Chat */}
              <TabsContent value="chat">
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                    {messages.length > 0 ? messages.map((msg) => {
                      const isMe = msg.sender_id === user?.id;
                      const senderName = msg.profiles?.name || "Anonymous";
                      const senderInitials = senderName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                      return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isMe ? "bg-secondary text-secondary-foreground" : "bg-gradient-accent text-white"}`}>
                            {senderInitials}
                          </div>
                          <div className={`max-w-[70%] ${isMe ? "text-right" : ""}`}>
                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                              {senderName}
                              {msg.pinned && <Pin className="ml-1 inline h-3 w-3 text-secondary" />}
                            </p>
                            <div className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                              {msg.content}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {new Date(msg.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">{isMember ? "No messages yet. Start the conversation!" : "Join the trip to chat with members."}</p>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {(isMember || isOrganizer) && (
                    <div className="border-t border-border p-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          className="h-11"
                        />
                        <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon" className="h-11 w-11 shrink-0">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Expenses */}
              <TabsContent value="expenses">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold text-foreground">${totalExpenses.toFixed(0)}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-sm text-muted-foreground">Per Person</p>
                      <p className="text-2xl font-bold text-secondary">${perPerson.toFixed(0)}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center col-span-2 sm:col-span-1">
                      <p className="text-sm text-muted-foreground">Expenses</p>
                      <p className="text-2xl font-bold text-foreground">{expenses.length}</p>
                    </div>
                  </div>

                  {(isMember || isOrganizer) && (
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-foreground">Expenses</h2>
                      <Button size="sm" onClick={() => setShowExpenseForm(!showExpenseForm)} className="gap-1">
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    </div>
                  )}

                  {showExpenseForm && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 space-y-3">
                      <Input placeholder="Expense title" value={newExpense.title} onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })} />
                      <Input type="number" placeholder="Amount ($)" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
                      <div className="flex flex-wrap gap-2">
                        {["General", "Accommodation", "Food", "Transportation", "Activities"].map((cat) => (
                          <button key={cat} onClick={() => setNewExpense({ ...newExpense, category: cat })} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${newExpense.category === cat ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                            {cat}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleAddExpense} disabled={!newExpense.title || !newExpense.amount}>Add</Button>
                        <Button size="sm" variant="ghost" onClick={() => setShowExpenseForm(false)}>Cancel</Button>
                      </div>
                    </motion.div>
                  )}

                  {expenses.length > 0 ? expenses.map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                      <div>
                        <p className="font-medium text-foreground">{exp.title}</p>
                        <p className="text-xs text-muted-foreground">Paid by {exp.profiles?.name || "Unknown"} · {exp.category}</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">${Number(exp.amount).toFixed(0)}</p>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
                      <p className="text-muted-foreground">No expenses tracked yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Join Card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  {trip.profiles?.avatar_url ? (
                    <img src={trip.profiles.avatar_url} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-accent text-xs font-bold text-white">
                      {trip.profiles?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{trip.profiles?.name || "Organizer"}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-secondary text-secondary" />
                      <span className="text-xs text-muted-foreground">{Number(trip.profiles?.rating || 0).toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 space-y-2 text-sm text-muted-foreground">
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

                {!user && !isOrganizer && !isMember && (
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    <Link to="/login" className="text-secondary hover:underline">Sign in</Link> to join this trip
                  </p>
                )}
              </div>

              {/* DM Organizer */}
              {user && !isOrganizer && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    // Create or find DM conversation
                    const { data: existing } = await supabase
                      .from("conversation_participants")
                      .select("conversation_id, conversations!inner(type)")
                      .eq("user_id", user.id);

                    let dmConvId: string | null = null;

                    if (existing) {
                      for (const p of existing) {
                        if ((p.conversations as any)?.type === "direct") {
                          const { data: otherParticipant } = await supabase
                            .from("conversation_participants")
                            .select("user_id")
                            .eq("conversation_id", p.conversation_id)
                            .eq("user_id", trip.organizer_id)
                            .single();
                          if (otherParticipant) { dmConvId = p.conversation_id; break; }
                        }
                      }
                    }

                    if (!dmConvId) {
                      const { data: newConv } = await supabase.from("conversations").insert({ type: "direct" }).select().single();
                      if (newConv) {
                        await supabase.from("conversation_participants").insert([
                          { conversation_id: newConv.id, user_id: user.id },
                          { conversation_id: newConv.id, user_id: trip.organizer_id },
                        ]);
                        dmConvId = newConv.id;
                      }
                    }

                    if (dmConvId) navigate(`/messages/${dmConvId}`);
                  }}
                >
                  Message Organizer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TripDetails;
