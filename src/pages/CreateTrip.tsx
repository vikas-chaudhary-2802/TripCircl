import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, FileText, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TRAVEL_STYLES, TRIP_IMAGES } from "@/lib/mock-data";

const steps = [
  { label: "Destination", icon: MapPin },
  { label: "Dates", icon: Calendar },
  { label: "Budget & Size", icon: DollarSign },
  { label: "Details", icon: FileText },
];

const CreateTrip = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    destination: "",
    country: "",
    startDate: "",
    endDate: "",
    budgetMin: "",
    budgetMax: "",
    maxGroupSize: "8",
    travelStyle: "",
    title: "",
    description: "",
  });

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const canNext = () => {
    switch (step) {
      case 0: return form.destination && form.country;
      case 1: return form.startDate && form.endDate;
      case 2: return form.budgetMin && form.budgetMax && form.maxGroupSize && form.travelStyle;
      case 3: return form.title && form.description;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to create a trip.", variant: "destructive" });
      navigate("/login");
      return;
    }

    setLoading(true);
    const randomImage = TRIP_IMAGES[Math.floor(Math.random() * TRIP_IMAGES.length)];

    const { data: trip, error } = await supabase.from("trips").insert({
      organizer_id: user.id,
      title: form.title,
      destination: form.destination,
      country: form.country,
      image_url: randomImage,
      start_date: form.startDate,
      end_date: form.endDate,
      budget_min: parseInt(form.budgetMin),
      budget_max: parseInt(form.budgetMax),
      max_group_size: parseInt(form.maxGroupSize),
      travel_style: form.travelStyle as any,
      description: form.description,
    }).select().single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Add organizer as first member
    await supabase.from("trip_members").insert({
      trip_id: trip.id,
      user_id: user.id,
      role: "organizer",
      status: "approved",
    });

    // Create group conversation for the trip
    const { data: conv } = await supabase.from("conversations").insert({
      trip_id: trip.id,
      type: "group",
      name: form.title,
    }).select().single();

    if (conv) {
      await supabase.from("conversation_participants").insert({
        conversation_id: conv.id,
        user_id: user.id,
      });
    }

    setLoading(false);
    toast({
      title: "Trip Created! 🎉",
      description: `"${form.title}" has been published. Other travelers can now find and join your trip.`,
    });
    navigate(`/trip/${trip.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-max px-4 pt-28 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
            Create a <span className="text-gradient">Trip</span>
          </h1>
          <p className="mb-10 text-muted-foreground">Set up your group trip and start finding travel partners.</p>

          {/* Progress Steps */}
          <div className="mb-10 flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                    i < step ? "bg-secondary text-secondary-foreground" :
                    i === step ? "bg-gradient-primary text-primary-foreground shadow-lg" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {i < step ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                  </div>
                  <span className={`hidden text-xs font-medium sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`mx-2 h-0.5 flex-1 rounded-full transition-colors duration-300 ${i < step ? "bg-secondary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="rounded-2xl border border-border bg-card p-8">
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Destination</label>
                  <Input placeholder="e.g., Bali, Tokyo, Patagonia" value={form.destination} onChange={(e) => update("destination", e.target.value)} className="h-12" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Country</label>
                  <Input placeholder="e.g., Indonesia, Japan, Argentina" value={form.country} onChange={(e) => update("country", e.target.value)} className="h-12" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Start Date</label>
                  <Input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} className="h-12" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">End Date</label>
                  <Input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} className="h-12" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Min Budget ($)</label>
                    <Input type="number" placeholder="1000" value={form.budgetMin} onChange={(e) => update("budgetMin", e.target.value)} className="h-12" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Max Budget ($)</label>
                    <Input type="number" placeholder="3000" value={form.budgetMax} onChange={(e) => update("budgetMax", e.target.value)} className="h-12" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Max Group Size</label>
                  <Input type="number" value={form.maxGroupSize} onChange={(e) => update("maxGroupSize", e.target.value)} className="h-12" min="2" max="20" />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-foreground">Travel Style</label>
                  <div className="flex flex-wrap gap-2">
                    {TRAVEL_STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => update("travelStyle", style)}
                        className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                          form.travelStyle === style
                            ? "bg-secondary text-secondary-foreground shadow-md"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Trip Title</label>
                  <Input placeholder="e.g., Bali Adventure Paradise" value={form.title} onChange={(e) => update("title", e.target.value)} className="h-12" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
                  <Textarea placeholder="Describe your trip, what activities you have planned, what kind of travelers you're looking for..." value={form.description} onChange={(e) => update("description", e.target.value)} className="min-h-[150px] resize-none" />
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="hero" onClick={handleSubmit} disabled={!canNext() || loading} className="gap-2" size="lg">
                {loading ? "Publishing..." : "Publish Trip 🚀"}
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateTrip;
