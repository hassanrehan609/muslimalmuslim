import { useEffect, useRef, useState } from "react";
import { Mic, Square, Upload, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

interface Rec { id: string; title: string | null; file_path: string; created_at: string }

/** Record or upload your own recitation of a surah; saved privately to your account. */
const MyRecitations = ({ surah }: { surah: number }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const ur = language === "ur";
  const [recs, setRecs] = useState<Rec[]>([]);
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("user_recitations").select("*").eq("surah", surah).order("created_at", { ascending: false });
    setRecs(data ?? []);
  };
  useEffect(() => { load(); }, [user, surah]);

  const save = async (blob: Blob, ext: string, title: string) => {
    if (!user) return;
    const path = `${user.id}/${surah}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("recitations").upload(path, blob, { contentType: blob.type });
    if (error) return toast.error(ur ? "محفوظ نہیں ہو سکا" : "Could not save recitation");
    await supabase.from("user_recitations").insert({ user_id: user.id, surah, title, file_path: path });
    toast.success(ur ? "تلاوت محفوظ ہو گئی" : "Recitation saved");
    load();
  };

  const toggleRecord = async () => {
    if (recording) { mediaRef.current?.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        const blob = new Blob(chunks, { type: mr.mimeType || "audio/webm" });
        save(blob, blob.type.includes("mp4") ? "m4a" : "webm", new Date().toLocaleString());
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
    } catch { toast.error(ur ? "مائیک کی اجازت درکار ہے" : "Microphone permission needed"); }
  };

  const play = async (r: Rec) => {
    const { data } = await supabase.storage.from("recitations").createSignedUrl(r.file_path, 3600);
    if (data?.signedUrl) new Audio(data.signedUrl).play();
  };

  const remove = async (r: Rec) => {
    await supabase.storage.from("recitations").remove([r.file_path]);
    await supabase.from("user_recitations").delete().eq("id", r.id);
    load();
  };

  return (
    <Card className="p-4 mb-6">
      <h3 className="font-semibold text-foreground mb-3">{ur ? "میری تلاوت" : "My Recitations"}</h3>
      <div className="flex gap-2 mb-3">
        <Button size="sm" variant={recording ? "default" : "outline"} onClick={toggleRecord} className="gap-2">
          {recording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {recording ? (ur ? "روکیں" : "Stop") : (ur ? "ریکارڈ" : "Record")}
        </Button>
        <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} className="gap-2">
          <Upload className="w-4 h-4" />{ur ? "اپلوڈ" : "Upload"}
        </Button>
        <input ref={fileRef} type="file" accept="audio/*" hidden onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) save(f, f.name.split(".").pop() || "mp3", f.name);
          e.target.value = "";
        }} />
      </div>
      {recs.length === 0 ? (
        <p className="text-sm text-muted-foreground">{ur ? "ابھی کوئی تلاوت محفوظ نہیں" : "No recitations saved yet"}</p>
      ) : recs.map((r) => (
        <div key={r.id} className="flex items-center gap-2 py-1">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => play(r)}><Play className="w-4 h-4" /></Button>
          <span className="flex-1 text-sm text-foreground truncate">{r.title}</span>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => remove(r)}><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
        </div>
      ))}
    </Card>
  );
};

export default MyRecitations;
