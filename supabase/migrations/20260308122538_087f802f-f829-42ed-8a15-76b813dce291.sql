
-- TRAVELTOGETHER FULL DATABASE SCHEMA

-- Enum for travel styles
CREATE TYPE public.travel_style AS ENUM ('Backpacker', 'Luxury', 'Adventure', 'Digital Nomad', 'Cultural', 'Relaxation');

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 1. PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  location TEXT DEFAULT '',
  age INTEGER,
  phone TEXT,
  languages TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  travel_interests TEXT[] DEFAULT '{}',
  travel_style travel_style,
  budget_range TEXT DEFAULT '',
  trips_joined INTEGER DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 0.0,
  total_ratings INTEGER DEFAULT 0,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  id_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, email_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'email_verified')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. TRIPS
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  country TEXT NOT NULL,
  image_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget_min INTEGER DEFAULT 0,
  budget_max INTEGER DEFAULT 0,
  max_group_size INTEGER DEFAULT 8,
  current_members INTEGER DEFAULT 1,
  travel_style travel_style,
  description TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trips viewable by everyone" ON public.trips FOR SELECT USING (true);
CREATE POLICY "Users can create trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update their trips" ON public.trips FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Organizers can delete their trips" ON public.trips FOR DELETE USING (auth.uid() = organizer_id);

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. TRIP MEMBERS
CREATE TABLE public.trip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('organizer', 'member')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members viewable by everyone" ON public.trip_members FOR SELECT USING (true);
CREATE POLICY "Users can request to join" ON public.trip_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Organizers can manage members" ON public.trip_members FOR UPDATE USING (EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND organizer_id = auth.uid()));
CREATE POLICY "Users can leave trips" ON public.trip_members FOR DELETE USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND organizer_id = auth.uid()));

-- 4. ITINERARY ITEMS
CREATE TABLE public.itinerary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  title TEXT NOT NULL,
  location TEXT DEFAULT '',
  time TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Itinerary viewable by everyone" ON public.itinerary_items FOR SELECT USING (true);
CREATE POLICY "Trip members can add items" ON public.itinerary_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.trip_members WHERE trip_id = itinerary_items.trip_id AND user_id = auth.uid() AND status = 'approved'));
CREATE POLICY "Item creators can update" ON public.itinerary_items FOR UPDATE USING (created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND organizer_id = auth.uid()));
CREATE POLICY "Item creators can delete" ON public.itinerary_items FOR DELETE USING (created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND organizer_id = auth.uid()));

-- 5. EXPENSES
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  paid_by UUID NOT NULL REFERENCES auth.users(id),
  split_among UUID[] DEFAULT '{}',
  category TEXT DEFAULT 'General',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Expenses viewable by trip members" ON public.expenses FOR SELECT USING (EXISTS (SELECT 1 FROM public.trip_members WHERE trip_id = expenses.trip_id AND user_id = auth.uid() AND status = 'approved'));
CREATE POLICY "Trip members can add expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = paid_by AND EXISTS (SELECT 1 FROM public.trip_members WHERE trip_id = expenses.trip_id AND user_id = auth.uid() AND status = 'approved'));
CREATE POLICY "Expense creators can delete" ON public.expenses FOR DELETE USING (paid_by = auth.uid());

-- 6. CONVERSATIONS
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view conversations" ON public.conversations FOR SELECT USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid()));
CREATE POLICY "Auth users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users see their participations" ON public.conversation_participants FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = auth.uid()));
CREATE POLICY "Auth users can add participants" ON public.conversation_participants FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 7. MESSAGES
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));
CREATE POLICY "Participants can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));

-- 8. RATINGS
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  safety INTEGER CHECK (safety BETWEEN 1 AND 5),
  communication INTEGER CHECK (communication BETWEEN 1 AND 5),
  reliability INTEGER CHECK (reliability BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(trip_id, reviewer_id, reviewee_id)
);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ratings viewable by everyone" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Trip members can rate" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = reviewer_id AND reviewer_id != reviewee_id);

-- 9. STORAGE
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('trip-images', 'trip-images', true);

CREATE POLICY "Avatar images are public" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Trip images are public" ON storage.objects FOR SELECT USING (bucket_id = 'trip-images');
CREATE POLICY "Auth users can upload trip images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'trip-images' AND auth.uid() IS NOT NULL);

-- Indexes
CREATE INDEX idx_trips_organizer ON public.trips(organizer_id);
CREATE INDEX idx_trips_status ON public.trips(status);
CREATE INDEX idx_trip_members_trip ON public.trip_members(trip_id);
CREATE INDEX idx_trip_members_user ON public.trip_members(user_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);
CREATE INDEX idx_expenses_trip ON public.expenses(trip_id);
CREATE INDEX idx_itinerary_trip ON public.itinerary_items(trip_id);
CREATE INDEX idx_ratings_reviewee ON public.ratings(reviewee_id);
CREATE INDEX idx_conversations_trip ON public.conversations(trip_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
