import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, DollarSign, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TripCardProps {
  trip: any;
  index?: number;
}

const TripCard = ({ trip, index = 0 }: TripCardProps) => {
  const image = trip.images?.[0] || trip.image_url || trip.image || "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80";
  const destination = trip.destination;
  const title = trip.title;
  const startDate = trip.startDate || trip.start_date;
  const endDate = trip.endDate || trip.end_date;
  const budget = trip.budget || trip.budget_min || trip.budgetRange?.[0] || 0;
  const maxMembers = trip.maxMembers || trip.max_group_size || trip.maxGroupSize || 8;
  const currentMembersCount = trip.currentMembersCount || trip.current_members || trip.currentMembers || 1;
  const spotsLeft = maxMembers - currentMembersCount;
  
  const organizer = trip.organizer || trip.profiles;
  const organizerName = organizer?.name || "Organizer";
  const organizerAvatar = organizer?.avatar || organizer?.avatar_url;
  const organizerRating = organizer?.rating || 0;
  const organizerInitials = organizerName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const tripId = trip._id || trip.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link to={`/trip/${trip.id}`} className="group block">
        <div className="overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(263_83%_58%_/_0.12)] hover:border-secondary/20">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={destination}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {trip.category && (
              <div className="absolute left-4 top-4">
                <Badge className="border-0 bg-white/20 text-white backdrop-blur-md">{trip.category}</Badge>
              </div>
            )}
            {spotsLeft <= 3 && spotsLeft > 0 && (
              <div className="absolute right-4 top-4">
                <Badge className="border-0 bg-destructive/90 text-destructive-foreground">{spotsLeft} spots left</Badge>
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="mb-1 text-lg font-bold text-white drop-shadow-md">{title}</h3>
                <span className="text-sm">{destination}</span>
            </div>
          </div>

          <div className="p-5">
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">
                  {startDate ? new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD"} -{" "}
                  {endDate ? new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs">${budget}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs">{currentMembersCount}/{maxMembers} members</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-xs">{Number(organizerRating).toFixed(1)}</span>
              </div>
            </div>

            {trip.tags && trip.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {trip.tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{tag}</span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 border-t border-border pt-4">
              {organizerAvatar ? (
                <img src={organizerAvatar} alt={organizerName} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-accent text-xs font-bold text-white">
                  {organizerInitials}
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-foreground">{organizerName}</p>
                <p className="text-xs text-muted-foreground">Organizer</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TripCard;
