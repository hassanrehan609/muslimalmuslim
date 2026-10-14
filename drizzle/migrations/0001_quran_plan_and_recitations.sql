CREATE TABLE public.quran_plan (
  user_id uuid PRIMARY KEY,
  next_surah integer NOT NULL DEFAULT 1,
  last_read_date date,
  streak integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.quran_plan TO authenticated;
GRANT ALL ON public.quran_plan TO service_role;
ALTER TABLE public.quran_plan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own plan select" ON public.quran_plan FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own plan insert" ON public.quran_plan FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own plan update" ON public.quran_plan FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.user_recitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  surah integer NOT NULL,
  ayah integer,
  title text,
  file_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.user_recitations TO authenticated;
GRANT ALL ON public.user_recitations TO service_role;
ALTER TABLE public.user_recitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own rec select" ON public.user_recitations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own rec insert" ON public.user_recitations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own rec delete" ON public.user_recitations FOR DELETE TO authenticated USING (auth.uid() = user_id);