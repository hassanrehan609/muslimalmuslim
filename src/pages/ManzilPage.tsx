import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Headphones, Moon, Sun, Sparkles, FileText, Repeat, Play, Pause, Minus, Plus, Check, ChevronRight, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useManzilProgress } from "@/hooks/useManzilProgress";
import { MORNING, EVENING, MANZIL_REFS, RECITERS, BENEFITS_EN, BENEFITS_UR } from "@/data/manzil";
import { toast } from "sonner";

type View = "home" | "azkar" | "read" | "listen" | "benefits";
interface Ayah { key: string; ref: string; arabic: string; urdu: string; number: number }

let manzilCache: Ayah[] | null = null;
const loadManzil = async (): Promise<Ayah[]> => {
  if (manzilCache) return manzilCache;
  const surahs = [...new Set(MANZIL_REFS.map((r) => r[0]))];
  const results = await Promise.all(
    surahs.map((s) => fetch(`https://api.alquran.cloud/v1/surah/${s}/editions/quran-uthmani,ur.jalandhry`).then((r) => r.json())),
  );
  const bySurah = new Map<number, { ar: any[]; ur: any[]; name: string }>();
  results.forEach((res, i) => bySurah.set(surahs[i], { ar: res.data[0].ayahs, ur: res.data[1].ayahs, name: res.data[0].englishName }));
  const out: Ayah[] = [];
  for (const [s, from, to] of MANZIL_REFS) {
    const d = bySurah.get(s)!;
    for (let a = from; a <= to; a++) {
      out.push({ key: `${s}:${a}`, ref: `${d.name} ${s}:${a}`, arabic: d.ar[a - 1].text, urdu: d.ur[a - 1].text, number: d.ar[a - 1].number });
    }
  }
  manzilCache = out;
  return out;
};

const fmt = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

const ManzilPage = () => {
  const { language } = useLanguage();
  const ur = language === "ur";
  const L = (en: string, u: string) => (ur ? u : en);
  const [view, setView] = useState<View>("home");
  const [session, setSession] = useState<"morning" | "evening">(new Date().getHours() < 15 ? "morning" : "evening");
  const { state, markDone, resetSession } = useManzilProgress();

  // ---- Azkar
  const list = session === "morning" ? MORNING : EVENING;
  const done = session === "morning" ? state.morning_done : state.evening_done;
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => { setIdx(Math.min(done.length, list.length - 1)); setCount(0); }, [session]); // eslint-disable-line
  const zikr = list[idx];

  const reciteTap = () => {
    const c = count + 1;
    navigator.vibrate?.(15);
    if (c < zikr.repeat) return setCount(c);
    markDone(session, zikr.id);
    setCount(0);
    if (idx < list.length - 1) setIdx(idx + 1);
    else toast.success(L("All azkar completed — mashallah!", "تمام اذکار مکمل — ماشاءاللہ!"));
  };

  // ---- Manzil text
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [fontSize, setFontSize] = useState(30);
  useEffect(() => {
    if ((view === "read" || view === "listen") && !ayahs.length)
      loadManzil().then(setAyahs).catch(() => toast.error(L("Could not load Manzil", "منزل لوڈ نہیں ہو سکی")));
  }, [view]); // eslint-disable-line

  // ---- Player (one reusable audio element so playback continues on mobile)
  const audio = useRef<HTMLAudioElement | null>(null);
  const [reciter, setReciter] = useState(RECITERS[0]);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [sleepMin, setSleepMin] = useState(0);
  const [sleepLeft, setSleepLeft] = useState(0);
  const [time, setTime] = useState({ t: 0, d: 0 });
  const stateRef = useRef({ cur: 0, repeat: false, reciter, ayahs });
  stateRef.current = { cur, repeat, reciter, ayahs };

  const srcFor = (i: number) => {
    const r = stateRef.current.reciter;
    return `https://cdn.islamic.network/quran/audio/${r.bitrate}/${r.id}/${stateRef.current.ayahs[i].number}.mp3`;
  };
  const playAt = (i: number) => {
    const list = stateRef.current.ayahs;
    if (!list.length) return;
    if (i >= list.length) {
      if (!stateRef.current.repeat) { setPlaying(false); setCur(0); return; }
      i = 0;
    }
    if (!audio.current) {
      audio.current = new Audio();
      audio.current.ontimeupdate = () => setTime({ t: audio.current!.currentTime, d: audio.current!.duration || 0 });
    }
    const a = audio.current;
    a.onended = () => playAt(stateRef.current.cur + 1);
    a.onerror = () => playAt(stateRef.current.cur + 1);
    a.src = srcFor(i);
    setCur(i);
    stateRef.current.cur = i;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  const toggle = () => {
    if (playing) { audio.current?.pause(); setPlaying(false); }
    else if (audio.current?.src) audio.current.play().then(() => setPlaying(true));
    else playAt(cur);
  };
  useEffect(() => () => { audio.current?.pause(); }, []);
  useEffect(() => { if (playing) playAt(cur); }, [reciter]); // eslint-disable-line

  // Sleep timer
  useEffect(() => {
    if (!sleepMin) return setSleepLeft(0);
    setSleepLeft(sleepMin * 60);
    const iv = setInterval(() => setSleepLeft((s) => {
      if (s <= 1) { audio.current?.pause(); setPlaying(false); setSleepMin(0); clearInterval(iv); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(iv);
  }, [sleepMin]);
  const cycleSleep = () => setSleepMin((m) => ({ 0: 15, 15: 30, 30: 60, 60: 0 } as Record<number, number>)[m]);

  const activeRef = useRef<HTMLDivElement>(null);
  useEffect(() => { activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, [cur]);

  const back = (
    <button onClick={() => { setView("home"); }} className="glass glass-interactive rounded-full p-2.5 mb-6 inline-flex" aria-label={L("Back", "واپس")}>
      <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
    </button>
  );

  const tiles = useMemo(() => [
    { v: "read" as View, icon: BookOpen, label: L("Read", "پڑھیں") },
    { v: "listen" as View, icon: Headphones, label: L("Listen", "سنیں") },
    { v: "benefits" as View, icon: FileText, label: L("Benefits", "فضائل") },
  ], [ur]); // eslint-disable-line

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-2xl" dir={ur ? "rtl" : "ltr"}>
        {view === "home" && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-foreground">{L("Manzil", "منزل")}</h1>
              <p className="font-arabic text-2xl text-gold mt-1">مَنْزِل</p>
            </div>

            <Card className="p-5 flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0"><Sparkles className="h-6 w-6" /></div>
              <div>
                <p className="text-xl font-bold text-foreground"><span className="text-3xl">{state.streak}</span> {L("day streak", "دن کا تسلسل")} 🔥</p>
                <p className="text-sm text-muted-foreground">{state.streak >= 7 ? L("A week of consistency — mashallah", "ایک ہفتے کی پابندی — ماشاءاللہ") : L("Recite daily to grow your streak", "روزانہ پڑھ کر تسلسل بڑھائیں")}</p>
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="text-lg font-semibold text-foreground mb-3">{L("Daily Azkar", "روزانہ اذکار")}</h2>
              <div className="grid grid-cols-2 gap-3">
                {(["morning", "evening"] as const).map((s) => {
                  const total = (s === "morning" ? MORNING : EVENING).length;
                  const d = (s === "morning" ? state.morning_done : state.evening_done).length;
                  return (
                    <button key={s} onClick={() => { setSession(s); setView("azkar"); }} className="glass-subtle glass-interactive rounded-2xl p-4 text-start">
                      <div className="flex items-center gap-2 font-semibold text-foreground">{s === "morning" ? <Sun className="h-4 w-4 text-gold" /> : <Moon className="h-4 w-4 text-gold" />}{s === "morning" ? L("Morning", "صبح") : L("Evening", "شام")}</div>
                      <p className="text-sm text-muted-foreground mt-1">{d}/{total} {L("done", "مکمل")}</p>
                      <Progress value={(d / total) * 100} className="h-1.5 mt-2" />
                    </button>
                  );
                })}
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              {tiles.map(({ v, icon: Icon, label }) => (
                <button key={v} onClick={() => setView(v)} className="glass glass-interactive rounded-3xl p-5 flex flex-col items-center gap-3">
                  <span className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Icon className="h-6 w-6" /></span>
                  <span className="font-medium text-foreground text-sm">{label}</span>
                </button>
              ))}
            </div>
            <Link to="/quran" className="glass glass-interactive rounded-2xl p-4 flex items-center justify-between text-foreground">
              {L("Open full Quran", "مکمل قرآن کھولیں")}<ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        )}

        {view === "azkar" && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setView("home")} className="glass glass-interactive rounded-full p-2.5" aria-label={L("Back", "واپس")}><ArrowLeft className="h-5 w-5 rtl:rotate-180" /></button>
              <div className="glass-nav rounded-full p-1 flex flex-1">
                {(["morning", "evening"] as const).map((s) => (
                  <button key={s} onClick={() => setSession(s)} className={`flex-1 rounded-full py-2.5 flex items-center justify-center gap-2 font-medium transition-colors ${session === s ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                    {s === "morning" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}{s === "morning" ? L("Morning", "صبح") : L("Evening", "شام")}
                  </button>
                ))}
              </div>
            </div>
            <Progress value={(done.length / list.length) * 100} className="h-2" />
            <div className="flex justify-between mt-2 mb-5 text-sm text-muted-foreground">
              <span>{done.length} {L("of", "از")} {list.length} {L("completed", "مکمل")}</span>
              <button onClick={() => { resetSession(session); setIdx(0); setCount(0); }} className="flex items-center gap-1"><RotateCcw className="h-3.5 w-3.5" />{L("Reset", "دوبارہ")}</button>
            </div>

            <Card className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="h-10 w-10 rounded-full glass-subtle flex items-center justify-center font-bold text-gold">{idx + 1}</span>
                {done.includes(zikr.id) && <span className="flex items-center gap-1 text-sm text-primary"><Check className="h-4 w-4" />{L("Done", "مکمل")}</span>}
              </div>
              <p dir="rtl" className="font-arabic text-3xl leading-[2.2] text-center text-foreground">{zikr.arabic}</p>
              <p className="text-center text-sm text-gold mt-6">{zikr.ref}</p>
              <p className="text-center text-muted-foreground mt-3">{ur ? zikr.benefitUr : zikr.benefitEn}</p>
              <Button onClick={reciteTap} size="lg" className="w-full mt-6 rounded-2xl h-14 text-lg">
                {zikr.repeat > 1 ? `${L("Recite", "پڑھیں")} ${count}/${zikr.repeat}` : L("Recite & Continue", "پڑھیں اور آگے بڑھیں")}
              </Button>
              <div className="flex justify-between mt-4">
                <Button variant="ghost" disabled={idx === 0} onClick={() => { setIdx(idx - 1); setCount(0); }}>{L("Previous", "پچھلا")}</Button>
                <Button variant="ghost" disabled={idx === list.length - 1} onClick={() => { setIdx(idx + 1); setCount(0); }}>{L("Skip", "اگلا")}</Button>
              </div>
            </Card>
          </div>
        )}

        {view === "read" && (
          <div className="animate-fade-in">
            {back}
            <div className="glass-nav sticky top-20 z-10 rounded-full p-2 flex items-center justify-center gap-4 mb-4">
              <Button size="icon" variant="ghost" onClick={() => setFontSize((f) => Math.max(20, f - 2))} aria-label="Smaller"><Minus className="h-4 w-4" /></Button>
              <span className="text-sm text-muted-foreground">{L("Text size", "سائز")}</span>
              <Button size="icon" variant="ghost" onClick={() => setFontSize((f) => Math.min(48, f + 2))} aria-label="Larger"><Plus className="h-4 w-4" /></Button>
            </div>
            {!ayahs.length ? <p className="text-center text-muted-foreground py-12">{L("Loading…", "لوڈ ہو رہا ہے…")}</p> : (
              <Card className="p-5 space-y-6">
                {ayahs.map((a) => (
                  <div key={a.key} className="border-b border-border/40 pb-5 last:border-0">
                    <p dir="rtl" className="font-arabic text-foreground text-center leading-[2.2]" style={{ fontSize }}>{a.arabic}</p>
                    <p dir="rtl" className="text-muted-foreground text-center mt-2 text-base">{a.urdu}</p>
                    <p className="text-xs text-gold text-center mt-1">{a.ref}</p>
                  </div>
                ))}
              </Card>
            )}
          </div>
        )}

        {view === "listen" && (
          <div className="animate-fade-in">
            {back}
            <div className="text-center mb-6">
              <p className="font-arabic text-3xl text-foreground">{reciter.arabic}</p>
              <p className="text-xl font-semibold text-foreground mt-2">{reciter.name}</p>
              <p className="text-sm text-muted-foreground">{reciter.country}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => setRepeat(!repeat)} className={`glass glass-interactive rounded-2xl py-3 flex items-center justify-center gap-2 ${repeat ? "text-primary ring-2 ring-primary" : "text-foreground"}`}>
                <Repeat className="h-5 w-5" />{L("Repeat", "دہرائیں")}
              </button>
              <button onClick={cycleSleep} className={`glass glass-interactive rounded-2xl py-3 flex items-center justify-center gap-2 ${sleepMin ? "text-primary ring-2 ring-primary" : "text-foreground"}`}>
                <Moon className="h-5 w-5" />{sleepMin ? fmt(sleepLeft) : L("Sleep", "سلیپ")}
              </button>
            </div>
            <Card className="glass-strong p-6">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary transition-[width]" style={{ width: `${time.d ? (time.t / time.d) * 100 : 0}%` }} /></div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2"><span>{fmt(time.t)}</span><span>{ayahs.length ? `${cur + 1}/${ayahs.length}` : ""}</span><span>{fmt(time.d)}</span></div>
              <div className="flex justify-center mt-4">
                <button onClick={toggle} disabled={!ayahs.length} className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center glass-interactive disabled:opacity-50" aria-label={playing ? "Pause" : "Play"}>
                  {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ms-1" />}
                </button>
              </div>
            </Card>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-6 mb-3">{L("Reciter", "قاری")}</p>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {RECITERS.map((r) => (
                <button key={r.id} onClick={() => setReciter(r)} className="flex flex-col items-center gap-1.5 shrink-0">
                  <span className={`h-16 w-16 rounded-full flex items-center justify-center font-semibold ${reciter.id === r.id ? "bg-primary text-primary-foreground ring-2 ring-gold" : "glass text-foreground"}`}>{r.short}</span>
                  <span className="text-xs text-foreground">{r.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
            {!!ayahs.length && (
              <Card className="p-4 mt-6 max-h-96 overflow-y-auto space-y-3">
                {ayahs.map((a, i) => (
                  <div key={a.key} ref={i === cur ? activeRef : undefined} onClick={() => playAt(i)} className={`rounded-xl p-3 cursor-pointer transition-colors ${i === cur ? "bg-primary/15" : ""}`}>
                    <p dir="rtl" className="font-arabic text-xl text-foreground leading-loose">{a.arabic}</p>
                    <p className="text-xs text-gold">{a.ref}</p>
                  </div>
                ))}
              </Card>
            )}
          </div>
        )}

        {view === "benefits" && (
          <div className="animate-fade-in">
            {back}
            <h1 className="text-3xl font-bold text-foreground mb-4">{L("Benefits", "فضائل")}</h1>
            <Card className="p-6 space-y-4">
              {(ur ? BENEFITS_UR : BENEFITS_EN).map((b, i) => <p key={i} className="text-foreground leading-relaxed text-lg">{b}</p>)}
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ManzilPage;
