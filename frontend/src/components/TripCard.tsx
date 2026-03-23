import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, DollarSign, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TripCardProps {
  trip: any;
  index?: number;
}

const TripCard = ({ trip, index = 0 }: TripCardProps) => {
  const spotsLeft = (trip.max_group_size || trip.maxGroupSize || 8) - (trip.current_members || trip.currentMembers || 1);
  const image = trip.image_url || trip.image || "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80";
  const destination = trip.destination;
  const country = trip.country;
  const title = trip.title;
  const startDate = trip.start_date || trip.startDate;
  const endDate = trip.end_date || trip.endDate;
  const budgetMin = trip.budget_min || trip.budgetRange?.[0] || 0;
  const budgetMax = trip.budget_max || trip.budgetRange?.[1] || 0;
  const maxGroupSize = trip.max_group_size || trip.maxGroupSize || 8;
  const currentMembers = trip.current_members || trip.currentMembers || 1;
  const travelStyle = trip.travel_style || trip.travelStyle || "";
  const tags = trip.tags || [];
  const organizer = trip.profiles || trip.organizer;
  const organizerName = organizer?.name || organizer?.avatar || "Organizer";
  const organizerRating = organizer?.rating || 0;
  const organizerInitials = organizerName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

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
            {travelStyle && (
              <div className="absolute left-4 top-4">
                <Badge className="border-0 bg-white/20 text-white backdrop-blur-md">{travelStyle}</Badge>
              </div>
            )}
            {spotsLeft <= 3 && spotsLeft > 0 && (
              <div className="absolute right-4 top-4">
                <Badge className="border-0 bg-destructive/90 text-destructive-foreground">{spotsLeft} spots left</Badge>
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="mb-1 text-lg font-bold text-white drop-shadow-md">{title}</h3>
              <div className="flex items-center gap-1 text-white/80">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-sm">{destination}, {country}</span>
              </div>
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
                <DollarSign className="h-4 w-4" />
                <span className="text-xs">${budgetMin} - ${budgetMax}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-xs">{currentMembers}/{maxGroupSize} members</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-xs">{Number(organizerRating).toFixed(1)}</span>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{tag}</span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 border-t border-border pt-4">
              {organizer?.avatar_url ? (
                <img src={organizer.avatar_url} alt={organizerName} className="h-8 w-8 rounded-full object-cover" />
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
