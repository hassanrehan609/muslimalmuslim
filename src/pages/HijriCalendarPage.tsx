import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Star, ArrowRightLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

interface HijriDate {
  day: string;
  month: { number: number; en: string; ar: string };
  year: string;
  weekday: { en: string; ar: string };
  designation: { abbreviated: string; expanded: string };
}

interface GregorianDate {
  day: string;
  month: { number: number; en: string };
  year: string;
  weekday: { en: string };
}

interface IslamicEvent {
  name: string;
  nameUrdu: string;
  arabic: string;
  month: number;
  day: number;
  description: string;
  descriptionUrdu: string;
}

const islamicEvents: IslamicEvent[] = [
  { name: "Islamic New Year", nameUrdu: "اسلامی نیا سال", arabic: "رأس السنة الهجرية", month: 1, day: 1, description: "First day of Muharram, marking the beginning of the Islamic calendar year.", descriptionUrdu: "محرم کا پہلا دن، اسلامی سال کا آغاز۔" },
  { name: "Ashura", nameUrdu: "عاشورہ", arabic: "عاشوراء", month: 1, day: 10, description: "Day of fasting commemorating various events in Islamic history.", descriptionUrdu: "روزے کا دن جو اسلامی تاریخ کے مختلف واقعات کی یاد میں منایا جاتا ہے۔" },
  { name: "Mawlid al-Nabi", nameUrdu: "میلاد النبی", arabic: "المولد النبوي", month: 3, day: 12, description: "Birth anniversary of Prophet Muhammad (PBUH).", descriptionUrdu: "نبی کریم ﷺ کی ولادت کا دن۔" },
  { name: "Isra and Mi'raj", nameUrdu: "شبِ معراج", arabic: "الإسراء والمعراج", month: 7, day: 27, description: "Night Journey and Ascension of Prophet Muhammad (PBUH).", descriptionUrdu: "نبی کریم ﷺ کا معراج کا سفر۔" },
  { name: "Shab-e-Barat", nameUrdu: "شبِ برات", arabic: "ليلة النصف من شعبان", month: 8, day: 15, description: "Night of Forgiveness and Blessings.", descriptionUrdu: "مغفرت اور برکتوں کی رات۔" },
  { name: "Ramadan Begins", nameUrdu: "رمضان کا آغاز", arabic: "بداية رمضان", month: 9, day: 1, description: "First day of the blessed month of fasting.", descriptionUrdu: "بابرکت روزوں کے مہینے کا پہلا دن۔" },
  { name: "Laylat al-Qadr", nameUrdu: "شبِ قدر", arabic: "ليلة القدر", month: 9, day: 27, description: "Night of Power - better than a thousand months.", descriptionUrdu: "ہزار مہینوں سے بہتر رات۔" },
  { name: "Eid al-Fitr", nameUrdu: "عید الفطر", arabic: "عيد الفطر", month: 10, day: 1, description: "Festival of Breaking the Fast, celebrating end of Ramadan.", descriptionUrdu: "رمضان کے اختتام پر روزے کھولنے کا تہوار۔" },
  { name: "Day of Arafah", nameUrdu: "یومِ عرفہ", arabic: "يوم عرفة", month: 12, day: 9, description: "Most important day of Hajj, a day of forgiveness and supplication.", descriptionUrdu: "حج کا سب سے اہم دن، مغفرت اور دعا کا دن۔" },
  { name: "Eid al-Adha", nameUrdu: "عید الاضحیٰ", arabic: "عيد الأضحى", month: 12, day: 10, description: "Festival of Sacrifice, commemorating Ibrahim's devotion.", descriptionUrdu: "قربانی کا تہوار، ابراہیم علیہ السلام کی فداکاری کی یاد میں۔" },
];

const hijriMonths = [
  { number: 1, en: "Muharram", ar: "محرم", ur: "محرم" },
  { number: 2, en: "Safar", ar: "صفر", ur: "صفر" },
  { number: 3, en: "Rabi' al-Awwal", ar: "ربيع الأول", ur: "ربیع الاول" },
  { number: 4, en: "Rabi' al-Thani", ar: "ربيع الثاني", ur: "ربیع الثانی" },
  { number: 5, en: "Jumada al-Awwal", ar: "جمادى الأولى", ur: "جمادی الاول" },
  { number: 6, en: "Jumada al-Thani", ar: "جمادى الآخرة", ur: "جمادی الثانی" },
  { number: 7, en: "Rajab", ar: "رجب", ur: "رجب" },
  { number: 8, en: "Sha'ban", ar: "شعبان", ur: "شعبان" },
  { number: 9, en: "Ramadan", ar: "رمضان", ur: "رمضان" },
  { number: 10, en: "Shawwal", ar: "شوال", ur: "شوال" },
  { number: 11, en: "Dhu al-Qi'dah", ar: "ذو القعدة", ur: "ذوالقعدہ" },
  { number: 12, en: "Dhu al-Hijjah", ar: "ذو الحجة", ur: "ذوالحجہ" },
];

const HijriCalendarPage = () => {
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [gregorianDate, setGregorianDate] = useState<GregorianDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [convertDate, setConvertDate] = useState("");
  const [convertedResult, setConvertedResult] = useState<string | null>(null);
  const [convertDirection, setConvertDirection] = useState<"toHijri" | "toGregorian">("toHijri");
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchTodayDate = async () => {
      try {
        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
        
        const response = await fetch(`https://api.aladhan.com/v1/gToH/${dateStr}`);
        const data = await response.json();
        
        setHijriDate(data.data.hijri);
        setGregorianDate(data.data.gregorian);
      } catch (error) {
        console.error("Failed to fetch Hijri date:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayDate();
  }, []);

  const handleConvert = async () => {
    if (!convertDate) return;
    
    try {
      const parts = convertDate.split("-");
      let dateStr: string;
      
      if (convertDirection === "toHijri") {
        // Format: YYYY-MM-DD to DD-MM-YYYY
        dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
        const response = await fetch(`https://api.aladhan.com/v1/gToH/${dateStr}`);
        const data = await response.json();
        const h = data.data.hijri;
        setConvertedResult(`${h.day} ${h.month.en} ${h.year} AH (${h.month.ar})`);
      } else {
        // Format: YYYY-MM-DD to DD-MM-YYYY
        dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
        const response = await fetch(`https://api.aladhan.com/v1/hToG/${dateStr}`);
        const data = await response.json();
        const g = data.data.gregorian;
        setConvertedResult(`${g.day} ${g.month.en} ${g.year}`);
      }
    } catch (error) {
      console.error("Conversion failed:", error);
      setConvertedResult(language === "ur" ? "تبدیلی ناکام۔ تاریخ کی شکل چیک کریں۔" : "Conversion failed. Please check the date format.");
    }
  };

  const upcomingEvents = islamicEvents.filter((event) => {
    if (!hijriDate) return false;
    const currentMonth = hijriDate.month.number;
    const currentDay = parseInt(hijriDate.day);
    
    if (event.month > currentMonth) return true;
    if (event.month === currentMonth && event.day >= currentDay) return true;
    return false;
  }).slice(0, 5);

  const getMonthEvents = (monthNumber: number) => {
    return islamicEvents.filter((event) => event.month === monthNumber);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("page.calendar")}</h1>
            <p className="text-xs text-muted-foreground font-arabic">{t("page.calendarArabic")}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Today's Date Card */}
        <Card className="p-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground mb-8">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            </div>
          ) : hijriDate && gregorianDate ? (
            <div className="text-center">
              <p className="text-sm opacity-80 mb-2">{gregorianDate.weekday.en}, {gregorianDate.month.en} {gregorianDate.day}, {gregorianDate.year}</p>
              
              <div className="mb-4">
                <p className="text-5xl font-bold mb-2">{hijriDate.day}</p>
                <p className="text-2xl font-arabic mb-1">{hijriDate.month.ar}</p>
                <p className="text-xl">{hijriDate.month.en} {hijriDate.year} AH</p>
              </div>

              <p className="text-lg font-arabic opacity-90">{hijriDate.weekday.ar}</p>
            </div>
          ) : (
            <p className="text-center">{language === "ur" ? "تاریخ لوڈ نہیں ہو سکی" : "Unable to load date"}</p>
          )}
        </Card>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="events">{t("calendar.events")}</TabsTrigger>
            <TabsTrigger value="months">{t("calendar.months")}</TabsTrigger>
            <TabsTrigger value="converter">{t("calendar.converter")}</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-gold" />
              {t("calendar.upcoming")}
            </h2>
            
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event, index) => (
                <Card key={index} className="p-5 bg-card border-border/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {language === "ur" ? event.nameUrdu : event.name}
                      </h3>
                      <p className="text-gold font-arabic">{event.arabic}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">
                        {event.day} {hijriMonths.find(m => m.number === event.month)?.en}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === "ur" ? event.descriptionUrdu : event.description}
                  </p>
                </Card>
              )) : (
                <p className="text-muted-foreground text-center py-8">
                  {language === "ur" ? "آنے والے واقعات لوڈ ہو رہے ہیں..." : "Loading upcoming events..."}
                </p>
              )}

              <h3 className="text-lg font-semibold text-foreground mt-8 mb-4">{t("calendar.allEvents")}</h3>
              <div className="space-y-3">
                {islamicEvents.map((event, index) => (
                  <Card key={index} className="p-4 bg-card border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">
                          {language === "ur" ? event.nameUrdu : event.name}
                        </h4>
                        <p className="text-sm text-gold font-arabic">{event.arabic}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.day} {hijriMonths.find(m => m.number === event.month)?.en}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="months">
            <h2 className="text-xl font-bold text-foreground mb-4">{t("calendar.islamicMonths")}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {hijriMonths.map((month) => {
                const monthEvents = getMonthEvents(month.number);
                const isCurrent = hijriDate?.month.number === month.number;
                
                return (
                  <Card 
                    key={month.number} 
                    className={`p-4 bg-card border-border/50 ${isCurrent ? "ring-2 ring-primary" : ""}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCurrent ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <span className="font-bold">{month.number}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{month.en}</h3>
                        <p className="text-gold font-arabic text-lg">{month.ar}</p>
                      </div>
                      {isCurrent && (
                        <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                          {t("calendar.current")}
                        </span>
                      )}
                    </div>
                    {monthEvents.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        {monthEvents.map((event, i) => (
                          <p key={i} className="text-sm text-muted-foreground">
                            <span className="text-primary font-medium">{event.day}:</span> {language === "ur" ? event.nameUrdu : event.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="converter">
            <Card className="p-6 bg-card border-border/50">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-gold" />
                {t("calendar.dateConverter")}
              </h2>

              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={convertDirection === "toHijri" ? "default" : "outline"}
                  onClick={() => {
                    setConvertDirection("toHijri");
                    setConvertedResult(null);
                  }}
                >
                  {t("calendar.gregorianToHijri")}
                </Button>
                <Button
                  variant={convertDirection === "toGregorian" ? "default" : "outline"}
                  onClick={() => {
                    setConvertDirection("toGregorian");
                    setConvertedResult(null);
                  }}
                >
                  {t("calendar.hijriToGregorian")}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {convertDirection === "toHijri" 
                      ? (language === "ur" ? "عیسوی تاریخ (YYYY-MM-DD)" : "Gregorian Date (YYYY-MM-DD)")
                      : (language === "ur" ? "ہجری تاریخ (YYYY-MM-DD)" : "Hijri Date (YYYY-MM-DD)")}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={convertDate}
                      onChange={(e) => setConvertDate(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleConvert}>
                      {t("calendar.convert")}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {convertDirection === "toHijri" 
                      ? (language === "ur" ? "ہجری میں تبدیل کرنے کے لیے عیسوی تاریخ درج کریں" : "Enter a Gregorian date to convert to Hijri")
                      : (language === "ur" ? "عیسوی میں تبدیل کرنے کے لیے ہجری تاریخ درج کریں (مثلاً 1446-07-15)" : "Enter a Hijri date (e.g., 1446-07-15) to convert to Gregorian")}
                  </p>
                </div>

                {convertedResult && (
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{t("calendar.result")}:</p>
                    <p className="text-lg font-semibold text-foreground">{convertedResult}</p>
                  </Card>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HijriCalendarPage;
