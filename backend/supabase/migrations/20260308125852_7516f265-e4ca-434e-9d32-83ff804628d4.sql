
-- Drop existing FK that points to wrong place, re-add pointing to profiles
ALTER TABLE public.trip_members DROP CONSTRAINT IF EXISTS trip_members_user_id_fkey;
ALTER TABLE public.trip_members 
  ADD CONSTRAINT trip_members_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add FK from expenses.paid_by to profiles.user_id
ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS expenses_paid_by_fkey;
ALTER TABLE public.expenses 
  ADD CONSTRAINT expenses_paid_by_fkey 
  FOREIGN KEY (paid_by) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add FK from messages.sender_id to profiles.user_id
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE public.messages 
  ADD CONSTRAINT messages_sender_id_fkey 
  FOREIGN KEY (sender_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add FK from conversation_participants.user_id to profiles.user_id
ALTER TABLE public.conversation_participants DROP CONSTRAINT IF EXISTS conversation_participants_user_id_fkey;
ALTER TABLE public.conversation_participants 
  ADD CONSTRAINT conversation_participants_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix conversation_participants.conversation_id FK
ALTER TABLE public.conversation_participants
  DROP CONSTRAINT IF EXISTS conversation_participants_conversation_id_fkey;
ALTER TABLE public.conversation_participants
  ADD CONSTRAINT conversation_participants_conversation_id_fkey
  FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;

-- Fix RLS recursion: security definer function
CREATE OR REPLACE FUNCTION public.is_conversation_participant(_conversation_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = _conversation_id AND user_id = _user_id
  )
$$;

-- Fix conversations SELECT policy
DROP POLICY IF EXISTS "Participants can view conversations" ON public.conversations;
CREATE POLICY "Participants can view conversations" ON public.conversations
  FOR SELECT TO authenticated
  USING (public.is_conversation_participant(id, auth.uid()));

-- Fix conversation_participants SELECT policy
DROP POLICY IF EXISTS "Users see their participations" ON public.conversation_participants;
CREATE POLICY "Users see their participations" ON public.conversation_participants
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_conversation_participant(conversation_id, auth.uid()));

-- Fix messages policies
DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
CREATE POLICY "Participants can view messages" ON public.messages
  FOR SELECT TO authenticated
  USING (public.is_conversation_participant(conversation_id, auth.uid()));

DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
CREATE POLICY "Participants can send messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id AND public.is_conversation_participant(conversation_id, auth.uid()));
