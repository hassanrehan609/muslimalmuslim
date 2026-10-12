CREATE TABLE public.manzil_progress (
  user_id uuid PRIMARY KEY,
  progress_date date NOT NULL DEFAULT current_date,
  morning_done integer[] NOT NULL DEFAULT '{}',
  evening_done integer[] NOT NULL DEFAULT '{}',
  streak integer NOT NULL DEFAULT 0,
  last_streak_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.manzil_progress TO authenticated;
GRANT ALL ON public.manzil_progress TO service_role;
ALTER TABLE public.manzil_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own manzil select" ON public.manzil_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own manzil insert" ON public.manzil_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own manzil update" ON public.manzil_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);