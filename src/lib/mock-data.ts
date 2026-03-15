export interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string;
  image: string;
  startDate: string;
  endDate: string;
  budget: string;
  budgetRange: [number, number];
  maxGroupSize: number;
  currentMembers: number;
  travelStyle: string;
  description: string;
  organizer: {
    name: string;
    avatar: string;
    rating: number;
  };
  tags: string[];
  itinerary: ItineraryItem[];
  members: Member[];
  expenses: Expense[];
  messages: Message[];
}

export interface ItineraryItem {
  id: string;
  day: number;
  title: string;
  location: string;
  time: string;
  notes: string;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: "organizer" | "member";
  joinedAt: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  date: string;
  category: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  pinned?: boolean;
}

export const TRAVEL_STYLES = ["Backpacker", "Luxury", "Adventure", "Digital Nomad", "Cultural", "Relaxation"];

export const TRIP_IMAGES = [
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
];

export const mockTrips: Trip[] = [
  {
    id: "1",
    title: "Bali Adventure Paradise",
    destination: "Bali",
    country: "Indonesia",
    image: TRIP_IMAGES[0],
    startDate: "2026-04-15",
    endDate: "2026-04-28",
    budget: "$1,500 - $2,500",
    budgetRange: [1500, 2500],
    maxGroupSize: 8,
    currentMembers: 4,
    travelStyle: "Adventure",
    description: "Explore the magical island of Bali! From rice terraces to sacred temples, surfing to volcano hikes. Join our group for an unforgettable adventure.",
    organizer: { name: "Alex Chen", avatar: "AC", rating: 4.9 },
    tags: ["Beach", "Culture", "Hiking", "Surfing"],
    itinerary: [
      { id: "i1", day: 1, title: "Arrival & Welcome Dinner", location: "Seminyak", time: "6:00 PM", notes: "Meet at the hotel lobby" },
      { id: "i2", day: 2, title: "Rice Terrace Trek", location: "Tegallalang", time: "8:00 AM", notes: "Wear comfortable shoes" },
      { id: "i3", day: 3, title: "Temple Hopping", location: "Uluwatu", time: "9:00 AM", notes: "Bring sarongs" },
      { id: "i4", day: 4, title: "Surfing Lessons", location: "Canggu", time: "7:00 AM", notes: "All levels welcome" },
      { id: "i5", day: 5, title: "Mt. Batur Sunrise Hike", location: "Kintamani", time: "3:00 AM", notes: "Early start!" },
    ],
    members: [
      { id: "m1", name: "Alex Chen", avatar: "AC", role: "organizer", joinedAt: "2026-01-15" },
      { id: "m2", name: "Maria Santos", avatar: "MS", role: "member", joinedAt: "2026-02-01" },
      { id: "m3", name: "Jake Wilson", avatar: "JW", role: "member", joinedAt: "2026-02-10" },
      { id: "m4", name: "Priya Patel", avatar: "PP", role: "member", joinedAt: "2026-02-20" },
    ],
    expenses: [
      { id: "e1", title: "Accommodation - 2 weeks", amount: 840, paidBy: "Alex Chen", splitAmong: ["Alex Chen", "Maria Santos", "Jake Wilson", "Priya Patel"], date: "2026-03-01", category: "Accommodation" },
      { id: "e2", title: "Surfing lessons for group", amount: 200, paidBy: "Jake Wilson", splitAmong: ["Alex Chen", "Maria Santos", "Jake Wilson", "Priya Patel"], date: "2026-03-05", category: "Activities" },
      { id: "e3", title: "Welcome dinner", amount: 120, paidBy: "Maria Santos", splitAmong: ["Alex Chen", "Maria Santos", "Jake Wilson", "Priya Patel"], date: "2026-03-08", category: "Food" },
    ],
    messages: [
      { id: "msg1", senderId: "m1", senderName: "Alex Chen", senderAvatar: "AC", content: "Hey everyone! Excited to have you all on board for Bali! 🌴", timestamp: "2026-03-01T10:00:00Z", pinned: true },
      { id: "msg2", senderId: "m2", senderName: "Maria Santos", senderAvatar: "MS", content: "Can't wait! Should we book the surfing lessons in advance?", timestamp: "2026-03-01T10:15:00Z" },
      { id: "msg3", senderId: "m3", senderName: "Jake Wilson", senderAvatar: "JW", content: "I already found a great surfing school in Canggu. I'll share the details.", timestamp: "2026-03-01T10:30:00Z" },
      { id: "msg4", senderId: "m4", senderName: "Priya Patel", senderAvatar: "PP", content: "Amazing! Also, I heard the sunrise hike at Mt. Batur is incredible.", timestamp: "2026-03-01T11:00:00Z" },
      { id: "msg5", senderId: "m1", senderName: "Alex Chen", senderAvatar: "AC", content: "Yes! I've added it to the itinerary for Day 5. We need to leave at 3 AM though 😅", timestamp: "2026-03-01T11:15:00Z" },
    ],
  },
  {
    id: "2",
    title: "Tokyo Culture & Tech Tour",
    destination: "Tokyo",
    country: "Japan",
    image: TRIP_IMAGES[1],
    startDate: "2026-05-01",
    endDate: "2026-05-10",
    budget: "$2,000 - $3,500",
    budgetRange: [2000, 3500],
    maxGroupSize: 6,
    currentMembers: 3,
    travelStyle: "Cultural",
    description: "Discover the perfect blend of ancient tradition and cutting-edge technology in Tokyo. From serene temples to neon-lit streets.",
    organizer: { name: "Yuki Tanaka", avatar: "YT", rating: 4.8 },
    tags: ["Culture", "Food", "Technology", "Shopping"],
    itinerary: [
      { id: "i1", day: 1, title: "Arrival & Shibuya Exploration", location: "Shibuya", time: "2:00 PM", notes: "Famous crossing!" },
      { id: "i2", day: 2, title: "Meiji Shrine & Harajuku", location: "Harajuku", time: "9:00 AM", notes: "Street fashion district" },
      { id: "i3", day: 3, title: "Tsukiji Market & Sushi Workshop", location: "Tsukiji", time: "6:00 AM", notes: "Fresh sushi!" },
    ],
    members: [
      { id: "m1", name: "Yuki Tanaka", avatar: "YT", role: "organizer", joinedAt: "2026-02-01" },
      { id: "m2", name: "David Kim", avatar: "DK", role: "member", joinedAt: "2026-02-15" },
      { id: "m3", name: "Sophie Martin", avatar: "SM", role: "member", joinedAt: "2026-03-01" },
    ],
    expenses: [
      { id: "e1", title: "Rail pass (7 days)", amount: 450, paidBy: "Yuki Tanaka", splitAmong: ["Yuki Tanaka", "David Kim", "Sophie Martin"], date: "2026-03-10", category: "Transportation" },
    ],
    messages: [
      { id: "msg1", senderId: "m1", senderName: "Yuki Tanaka", senderAvatar: "YT", content: "Welcome to the Tokyo trip group! 🗼", timestamp: "2026-02-01T08:00:00Z", pinned: true },
      { id: "msg2", senderId: "m2", senderName: "David Kim", senderAvatar: "DK", content: "So excited! Any recommendations for ramen spots?", timestamp: "2026-02-01T09:00:00Z" },
    ],
  },
  {
    id: "3",
    title: "Patagonia Wilderness Trek",
    destination: "Patagonia",
    country: "Argentina",
    image: TRIP_IMAGES[2],
    startDate: "2026-06-10",
    endDate: "2026-06-24",
    budget: "$2,500 - $4,000",
    budgetRange: [2500, 4000],
    maxGroupSize: 10,
    currentMembers: 6,
    travelStyle: "Adventure",
    description: "14 days of epic trekking through Patagonia's most breathtaking landscapes. Glaciers, mountains, and pristine wilderness.",
    organizer: { name: "Lucas Moretti", avatar: "LM", rating: 4.7 },
    tags: ["Trekking", "Nature", "Photography", "Camping"],
    itinerary: [],
    members: [
      { id: "m1", name: "Lucas Moretti", avatar: "LM", role: "organizer", joinedAt: "2026-01-01" },
      { id: "m2", name: "Emma Johnson", avatar: "EJ", role: "member", joinedAt: "2026-01-20" },
      { id: "m3", name: "Raj Sharma", avatar: "RS", role: "member", joinedAt: "2026-02-05" },
      { id: "m4", name: "Ana Costa", avatar: "ACo", role: "member", joinedAt: "2026-02-12" },
      { id: "m5", name: "Tom Baker", avatar: "TB", role: "member", joinedAt: "2026-02-25" },
      { id: "m6", name: "Mei Lin", avatar: "ML", role: "member", joinedAt: "2026-03-01" },
    ],
    expenses: [],
    messages: [],
  },
  {
    id: "4",
    title: "Digital Nomad Lisbon Life",
    destination: "Lisbon",
    country: "Portugal",
    image: TRIP_IMAGES[3],
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    budget: "$1,000 - $2,000",
    budgetRange: [1000, 2000],
    maxGroupSize: 12,
    currentMembers: 7,
    travelStyle: "Digital Nomad",
    description: "Work and explore beautiful Lisbon for a month. Coworking spaces, amazing food, and vibrant nightlife. Perfect for remote workers.",
    organizer: { name: "Nina Kowalski", avatar: "NK", rating: 4.6 },
    tags: ["Coworking", "Nightlife", "Food", "Beach"],
    itinerary: [],
    members: [
      { id: "m1", name: "Nina Kowalski", avatar: "NK", role: "organizer", joinedAt: "2026-01-10" },
    ],
    expenses: [],
    messages: [],
  },
  {
    id: "5",
    title: "Moroccan Desert Expedition",
    destination: "Marrakech",
    country: "Morocco",
    image: TRIP_IMAGES[4],
    startDate: "2026-05-20",
    endDate: "2026-05-30",
    budget: "$800 - $1,500",
    budgetRange: [800, 1500],
    maxGroupSize: 8,
    currentMembers: 2,
    travelStyle: "Adventure",
    description: "From the bustling souks of Marrakech to the Sahara Desert. Camel treks, camping under the stars, and ancient cities.",
    organizer: { name: "Omar Hassan", avatar: "OH", rating: 5.0 },
    tags: ["Desert", "Culture", "Camping", "Photography"],
    itinerary: [],
    members: [
      { id: "m1", name: "Omar Hassan", avatar: "OH", role: "organizer", joinedAt: "2026-02-01" },
      { id: "m2", name: "Claire Dubois", avatar: "CD", role: "member", joinedAt: "2026-03-01" },
    ],
    expenses: [],
    messages: [],
  },
  {
    id: "6",
    title: "Greek Island Luxury Retreat",
    destination: "Santorini",
    country: "Greece",
    image: TRIP_IMAGES[5],
    startDate: "2026-07-01",
    endDate: "2026-07-10",
    budget: "$3,000 - $5,000",
    budgetRange: [3000, 5000],
    maxGroupSize: 6,
    currentMembers: 3,
    travelStyle: "Luxury",
    description: "Indulge in the luxury of Santorini. Private villas, sunset cruises, wine tasting, and world-class dining.",
    organizer: { name: "Isabella Romano", avatar: "IR", rating: 4.9 },
    tags: ["Luxury", "Wine", "Beach", "Sunset"],
    itinerary: [],
    members: [
      { id: "m1", name: "Isabella Romano", avatar: "IR", role: "organizer", joinedAt: "2026-03-01" },
    ],
    expenses: [],
    messages: [],
  },
];

export const mockUser = {
  id: "current-user",
  name: "Jordan Smith",
  email: "jordan@example.com",
  avatar: "JS",
  location: "San Francisco, CA",
  bio: "Passionate traveler, photographer, and food lover. Always looking for the next adventure!",
  travelInterests: ["Adventure", "Culture", "Food", "Photography"],
  budgetRange: "$1,000 - $3,000",
  travelStyle: "Adventure",
  tripsJoined: 12,
  rating: 4.8,
  joinedDate: "2025-06-15",
  verifications: ["email", "phone"],
};
