
-- Drop existing FK that points to auth.users
ALTER TABLE public.trips DROP CONSTRAINT trips_organizer_id_fkey;

-- Recreate pointing to profiles.user_id
ALTER TABLE public.trips 
  ADD CONSTRAINT trips_organizer_id_fkey 
  FOREIGN KEY (organizer_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Check and fix ratings FKs too
ALTER TABLE public.ratings DROP CONSTRAINT IF EXISTS ratings_reviewer_id_fkey;
ALTER TABLE public.ratings 
  ADD CONSTRAINT ratings_reviewer_id_fkey 
  FOREIGN KEY (reviewer_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.ratings DROP CONSTRAINT IF EXISTS ratings_reviewee_id_fkey;
ALTER TABLE public.ratings 
  ADD CONSTRAINT ratings_reviewee_id_fkey 
  FOREIGN KEY (reviewee_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
