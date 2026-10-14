import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const day = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-CA");
};

export interface QuranPlan { next_surah: number; last_read_date: string | null; streak: number }

/** Daily surah plan: one surah per day, streak synced to the user's account. */
export const useQuranPlan = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<QuranPlan>({ next_surah: 1, last_read_date: null, streak: 0 });

  useEffect(() => {
    if (!user) return;
    supabase.from("quran_plan").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (!data) return;
      const streak = data.last_read_date && data.last_read_date !== day() && data.last_read_date !== day(-1) ? 0 : data.streak;
      setPlan({ next_surah: data.next_surah, last_read_date: data.last_read_date, streak });
    });
  }, [user]);

  const doneToday = plan.last_read_date === day();
  // If already read today, today's surah is the one before next_surah
  const todaySurah = doneToday ? ((plan.next_surah + 112) % 114) + 1 : plan.next_surah;

  const markRead = useCallback(async () => {
    if (doneToday || !user) return;
    const next: QuranPlan = {
      next_surah: (plan.next_surah % 114) + 1,
      last_read_date: day(),
      streak: plan.last_read_date === day(-1) ? plan.streak + 1 : 1,
    };
    setPlan(next);
    await supabase.from("quran_plan").upsert({ user_id: user.id, ...next, updated_at: new Date().toISOString() });
  }, [plan, doneToday, user]);

  return { plan, todaySurah, doneToday, markRead };
};
