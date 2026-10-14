import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const today = () => new Date().toLocaleDateString("en-CA");
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
};

export interface ManzilState {
  progress_date: string;
  morning_done: number[];
  evening_done: number[];
  streak: number;
  last_streak_date: string | null;
}

const empty = (): ManzilState => ({ progress_date: today(), morning_done: [], evening_done: [], streak: 0, last_streak_date: null });

/** Manzil azkar progress + streak, saved to the user's account so it follows them across phones. */
export const useManzilProgress = () => {
  const { user } = useAuth();
  const [state, setState] = useState<ManzilState>(empty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase.from("manzil_progress").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        const s: ManzilState = {
          progress_date: data.progress_date,
          morning_done: data.morning_done ?? [],
          evening_done: data.evening_done ?? [],
          streak: data.streak,
          last_streak_date: data.last_streak_date,
        };
        if (s.progress_date !== today()) {
          s.progress_date = today();
          s.morning_done = [];
          s.evening_done = [];
        }
        if (s.last_streak_date && s.last_streak_date !== today() && s.last_streak_date !== yesterday()) s.streak = 0;
        setState(s);
      }
      setLoading(false);
    })();
  }, [user]);

  const save = useCallback(
    async (next: ManzilState) => {
      setState(next);
      if (!user) return;
      await supabase.from("manzil_progress").upsert({ user_id: user.id, ...next, updated_at: new Date().toISOString() });
    },
    [user],
  );

  const markDone = useCallback(
    (session: "morning" | "evening", id: number) => {
      const key = session === "morning" ? "morning_done" : "evening_done";
      if (state[key].includes(id)) return;
      const next: ManzilState = { ...state, [key]: [...state[key], id] };
      if (next.last_streak_date !== today()) {
        next.streak = next.last_streak_date === yesterday() ? next.streak + 1 : 1;
        next.last_streak_date = today();
      }
      save(next);
    },
    [state, save],
  );

  const resetSession = useCallback(
    (session: "morning" | "evening") => save({ ...state, [session === "morning" ? "morning_done" : "evening_done"]: [] }),
    [state, save],
  );

  return { state, loading, markDone, resetSession };
};
