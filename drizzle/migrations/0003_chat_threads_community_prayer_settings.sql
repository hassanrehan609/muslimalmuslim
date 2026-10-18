CREATE TABLE public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'New chat',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own threads all" ON public.chat_threads FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.chat_messages ADD COLUMN thread_id uuid;
CREATE INDEX chat_messages_thread_idx ON public.chat_messages(thread_id, created_at);
CREATE POLICY "Users can delete their own messages" ON public.chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);
GRANT SELECT, INSERT, DELETE ON public.chat_messages TO authenticated;

CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  author_name text NOT NULL DEFAULT 'Member',
  kind text NOT NULL DEFAULT 'note',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read posts" ON public.community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Own post insert" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND char_length(content) <= 500);
CREATE POLICY "Own post delete" ON public.community_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.user_prayer_settings (
  user_id uuid PRIMARY KEY,
  city text,
  country text,
  latitude double precision,
  longitude double precision,
  auto_share boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_prayer_settings TO authenticated;
GRANT ALL ON public.user_prayer_settings TO service_role;
ALTER TABLE public.user_prayer_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own settings select" ON public.user_prayer_settings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own settings insert" ON public.user_prayer_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own settings update" ON public.user_prayer_settings FOR UPDATE TO authenticated USING (auth.uid() = user_id);