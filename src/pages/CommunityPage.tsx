import { useEffect, useState } from "react";
import { BookOpen, Clock, Loader2, Send, Trash2, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { shareToCommunity } from "@/lib/community";
import { toast } from "sonner";

type Post = { id: string; user_id: string; author_name: string; kind: string; content: string; created_at: string };
const badge: Record<string, string> = { manzil: "Manzil", quran: "Quran", prayer: "Namaz", note: "Note" };

const CommunityPage = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const ur = language === "ur";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [autoShare, setAutoShare] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("community_posts").select("*").order("created_at", { ascending: false }).limit(100);
    setPosts((data as Post[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("community").on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("user_prayer_settings").select("auto_share").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setAutoShare(data?.auto_share ?? true));
  }, [user]);

  const toggleAuto = async (v: boolean) => {
    setAutoShare(v);
    if (user) await supabase.from("user_prayer_settings").upsert({ user_id: user.id, auto_share: v, updated_at: new Date().toISOString() });
  };

  const post = async () => {
    if (!text.trim()) return;
    if (await shareToCommunity("note", text.trim(), { manual: true })) { setText(""); load(); }
    else toast.error("Could not post");
  };

  const remove = async (id: string) => { await supabase.from("community_posts").delete().eq("id", id); load(); };

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-2xl space-y-5">
        <div className="text-center">
          <Users className="w-8 h-8 text-primary mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-foreground">{ur ? "کمیونٹی" : "Community"}</h1>
          <p className="text-muted-foreground text-sm">{ur ? "منزل، قرآن اور نماز کی پیشرفت شیئر کریں" : "Share Manzil progress, Quran readings and prayer times"}</p>
        </div>

        <Card className="p-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-medium text-foreground">{ur ? "خودکار شیئر" : "Auto-share my progress"}</p>
            <p className="text-xs text-muted-foreground">{ur ? "بند کریں تو صرف شیئر بٹن سے پوسٹ ہوگا" : "Turn off to post only when you tap Share"}</p>
          </div>
          <Switch checked={autoShare} onCheckedChange={toggleAuto} />
        </Card>

        <Card className="p-4 space-y-2">
          <Textarea value={text} maxLength={500} onChange={(e) => setText(e.target.value)} placeholder={ur ? "کچھ شیئر کریں…" : "Share something with the community…"} />
          <div className="flex justify-end"><Button onClick={post} size="sm"><Send className="w-4 h-4 mr-1" />{ur ? "پوسٹ" : "Post"}</Button></div>
        </Card>

        {loading ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> :
          posts.length === 0 ? <p className="text-center text-muted-foreground">{ur ? "ابھی کوئی پوسٹ نہیں" : "No posts yet — be the first!"}</p> :
          posts.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{p.author_name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary flex items-center gap-1">
                    {p.kind === "quran" ? <BookOpen className="w-3 h-3" /> : <Clock className="w-3 h-3" />}{badge[p.kind] || p.kind}
                  </span>
                </div>
                {p.user_id === user?.id && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(p.id)} aria-label="Delete"><Trash2 className="w-4 h-4" /></Button>}
              </div>
              <p className="text-foreground whitespace-pre-wrap">{p.content}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(p.created_at).toLocaleString()}</p>
            </Card>
          ))}
      </main>
      <Footer />
    </div>
  );
};

export default CommunityPage;
