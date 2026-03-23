CREATE TABLE public.waitlist_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  feature TEXT NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Allow anyone to insert (no auth required for waitlist)
ALTER TABLE public.waitlist_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
ON public.waitlist_emails
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Only service role can read waitlist"
ON public.waitlist_emails
FOR SELECT
TO authenticated
USING (false);
