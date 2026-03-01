import { Link } from "react-router-dom";
import { ArrowLeft, Search, Heart, Play, Pause, Volume2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const namesOfAllah = [
  { number: 1, arabic: "الرَّحْمَنُ", transliteration: "Ar-Rahman", meaning: "The Most Gracious", meaningUrdu: "بہت مہربان" },
  { number: 2, arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: "The Most Merciful", meaningUrdu: "نہایت رحم والا" },
  { number: 3, arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King", meaningUrdu: "بادشاہ" },
  { number: 4, arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaning: "The Most Holy", meaningUrdu: "بہت پاک" },
  { number: 5, arabic: "السَّلاَمُ", transliteration: "As-Salam", meaning: "The Source of Peace", meaningUrdu: "سلامتی دینے والا" },
  { number: 6, arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", meaning: "The Guardian of Faith", meaningUrdu: "امن دینے والا" },
  { number: 7, arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaning: "The Protector", meaningUrdu: "نگہبان" },
  { number: 8, arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", meaning: "The Almighty", meaningUrdu: "غالب" },
  { number: 9, arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", meaning: "The Compeller", meaningUrdu: "زبردست" },
  { number: 10, arabic: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", meaning: "The Supreme", meaningUrdu: "بڑائی والا" },
  { number: 11, arabic: "الْخَالِقُ", transliteration: "Al-Khaliq", meaning: "The Creator", meaningUrdu: "پیدا کرنے والا" },
  { number: 12, arabic: "الْبَارِئُ", transliteration: "Al-Bari", meaning: "The Evolver", meaningUrdu: "بنانے والا" },
  { number: 13, arabic: "الْمُصَوِّرُ", transliteration: "Al-Musawwir", meaning: "The Fashioner", meaningUrdu: "صورت بنانے والا" },
  { number: 14, arabic: "الْغَفَّارُ", transliteration: "Al-Ghaffar", meaning: "The Forgiver", meaningUrdu: "بخشنے والا" },
  { number: 15, arabic: "الْقَهَّارُ", transliteration: "Al-Qahhar", meaning: "The Subduer", meaningUrdu: "غالب آنے والا" },
  { number: 16, arabic: "الْوَهَّابُ", transliteration: "Al-Wahhab", meaning: "The Bestower", meaningUrdu: "بہت دینے والا" },
  { number: 17, arabic: "الرَّزَّاقُ", transliteration: "Ar-Razzaq", meaning: "The Provider", meaningUrdu: "رزق دینے والا" },
  { number: 18, arabic: "الْفَتَّاحُ", transliteration: "Al-Fattah", meaning: "The Opener", meaningUrdu: "کھولنے والا" },
  { number: 19, arabic: "اَلْعَلِيْمُ", transliteration: "Al-Alim", meaning: "The All-Knowing", meaningUrdu: "سب جاننے والا" },
  { number: 20, arabic: "الْقَابِضُ", transliteration: "Al-Qabid", meaning: "The Restrainer", meaningUrdu: "تنگی کرنے والا" },
  { number: 21, arabic: "الْبَاسِطُ", transliteration: "Al-Basit", meaning: "The Expander", meaningUrdu: "کشادگی دینے والا" },
  { number: 22, arabic: "الْخَافِضُ", transliteration: "Al-Khafid", meaning: "The Abaser", meaningUrdu: "پست کرنے والا" },
  { number: 23, arabic: "الرَّافِعُ", transliteration: "Ar-Rafi", meaning: "The Exalter", meaningUrdu: "بلند کرنے والا" },
  { number: 24, arabic: "الْمُعِزُّ", transliteration: "Al-Mu'izz", meaning: "The Bestower of Honor", meaningUrdu: "عزت دینے والا" },
  { number: 25, arabic: "المُذِلُّ", transliteration: "Al-Mudhill", meaning: "The Humiliator", meaningUrdu: "ذلت دینے والا" },
  { number: 26, arabic: "السَّمِيعُ", transliteration: "As-Sami", meaning: "The All-Hearing", meaningUrdu: "سب سننے والا" },
  { number: 27, arabic: "الْبَصِيرُ", transliteration: "Al-Basir", meaning: "The All-Seeing", meaningUrdu: "سب دیکھنے والا" },
  { number: 28, arabic: "الْحَكَمُ", transliteration: "Al-Hakam", meaning: "The Judge", meaningUrdu: "فیصلہ کرنے والا" },
  { number: 29, arabic: "الْعَدْلُ", transliteration: "Al-Adl", meaning: "The Just", meaningUrdu: "انصاف کرنے والا" },
  { number: 30, arabic: "اللَّطِيفُ", transliteration: "Al-Latif", meaning: "The Subtle One", meaningUrdu: "باریک بین" },
  { number: 31, arabic: "الْخَبِيرُ", transliteration: "Al-Khabir", meaning: "The All-Aware", meaningUrdu: "باخبر" },
  { number: 32, arabic: "الْحَلِيمُ", transliteration: "Al-Halim", meaning: "The Forbearing", meaningUrdu: "بردبار" },
  { number: 33, arabic: "الْعَظِيمُ", transliteration: "Al-Azim", meaning: "The Magnificent", meaningUrdu: "عظمت والا" },
  { number: 34, arabic: "الْغَفُورُ", transliteration: "Al-Ghafur", meaning: "The Forgiving", meaningUrdu: "بخشنے والا" },
  { number: 35, arabic: "الشَّكُورُ", transliteration: "Ash-Shakur", meaning: "The Appreciative", meaningUrdu: "قدر کرنے والا" },
  { number: 36, arabic: "الْعَلِيُّ", transliteration: "Al-Ali", meaning: "The Most High", meaningUrdu: "بلند" },
  { number: 37, arabic: "الْكَبِيرُ", transliteration: "Al-Kabir", meaning: "The Greatest", meaningUrdu: "بڑا" },
  { number: 38, arabic: "الْحَفِيظُ", transliteration: "Al-Hafiz", meaning: "The Preserver", meaningUrdu: "حفاظت کرنے والا" },
  { number: 39, arabic: "المُقيِت", transliteration: "Al-Muqit", meaning: "The Nourisher", meaningUrdu: "روزی دینے والا" },
  { number: 40, arabic: "الْحسِيبُ", transliteration: "Al-Hasib", meaning: "The Reckoner", meaningUrdu: "حساب لینے والا" },
  { number: 41, arabic: "الْجَلِيلُ", transliteration: "Al-Jalil", meaning: "The Majestic", meaningUrdu: "جلال والا" },
  { number: 42, arabic: "الْكَرِيمُ", transliteration: "Al-Karim", meaning: "The Generous", meaningUrdu: "کریم" },
  { number: 43, arabic: "الرَّقِيبُ", transliteration: "Ar-Raqib", meaning: "The Watchful", meaningUrdu: "نگران" },
  { number: 44, arabic: "الْمُجِيبُ", transliteration: "Al-Mujib", meaning: "The Responsive", meaningUrdu: "قبول کرنے والا" },
  { number: 45, arabic: "الْوَاسِعُ", transliteration: "Al-Wasi", meaning: "The All-Encompassing", meaningUrdu: "وسعت والا" },
  { number: 46, arabic: "الْحَكِيمُ", transliteration: "Al-Hakim", meaning: "The Wise", meaningUrdu: "حکمت والا" },
  { number: 47, arabic: "الْوَدُودُ", transliteration: "Al-Wadud", meaning: "The Loving", meaningUrdu: "محبت کرنے والا" },
  { number: 48, arabic: "الْمَجِيدُ", transliteration: "Al-Majid", meaning: "The Glorious", meaningUrdu: "بزرگی والا" },
  { number: 49, arabic: "الْبَاعِثُ", transliteration: "Al-Ba'ith", meaning: "The Resurrector", meaningUrdu: "اٹھانے والا" },
  { number: 50, arabic: "الشَّهِيدُ", transliteration: "Ash-Shahid", meaning: "The Witness", meaningUrdu: "گواہ" },
  { number: 51, arabic: "الْحَقُّ", transliteration: "Al-Haqq", meaning: "The Truth", meaningUrdu: "سچا" },
  { number: 52, arabic: "الْوَكِيلُ", transliteration: "Al-Wakil", meaning: "The Trustee", meaningUrdu: "کارساز" },
  { number: 53, arabic: "الْقَوِيُّ", transliteration: "Al-Qawiyy", meaning: "The Strong", meaningUrdu: "طاقتور" },
  { number: 54, arabic: "الْمَتِينُ", transliteration: "Al-Matin", meaning: "The Firm", meaningUrdu: "مضبوط" },
  { number: 55, arabic: "الْوَلِيُّ", transliteration: "Al-Waliyy", meaning: "The Protecting Friend", meaningUrdu: "دوست" },
  { number: 56, arabic: "الْحَمِيدُ", transliteration: "Al-Hamid", meaning: "The Praiseworthy", meaningUrdu: "تعریف کے لائق" },
  { number: 57, arabic: "الْمُحْصِي", transliteration: "Al-Muhsi", meaning: "The Counter", meaningUrdu: "گننے والا" },
  { number: 58, arabic: "الْمُبْدِئُ", transliteration: "Al-Mubdi", meaning: "The Originator", meaningUrdu: "پہلی بار پیدا کرنے والا" },
  { number: 59, arabic: "الْمُعِيدُ", transliteration: "Al-Mu'id", meaning: "The Restorer", meaningUrdu: "دوبارہ پیدا کرنے والا" },
  { number: 60, arabic: "الْمُحْيِي", transliteration: "Al-Muhyi", meaning: "The Giver of Life", meaningUrdu: "زندگی دینے والا" },
  { number: 61, arabic: "اَلْمُمِيتُ", transliteration: "Al-Mumit", meaning: "The Giver of Death", meaningUrdu: "موت دینے والا" },
  { number: 62, arabic: "الْحَيُّ", transliteration: "Al-Hayy", meaning: "The Ever-Living", meaningUrdu: "زندہ" },
  { number: 63, arabic: "الْقَيُّومُ", transliteration: "Al-Qayyum", meaning: "The Self-Subsisting", meaningUrdu: "قائم رہنے والا" },
  { number: 64, arabic: "الْوَاجِدُ", transliteration: "Al-Wajid", meaning: "The Finder", meaningUrdu: "پانے والا" },
  { number: 65, arabic: "الْمَاجِدُ", transliteration: "Al-Majid", meaning: "The Noble", meaningUrdu: "شریف" },
  { number: 66, arabic: "الْواحِدُ", transliteration: "Al-Wahid", meaning: "The One", meaningUrdu: "ایک" },
  { number: 67, arabic: "اَلاَحَدُ", transliteration: "Al-Ahad", meaning: "The Unique", meaningUrdu: "اکیلا" },
  { number: 68, arabic: "الصَّمَدُ", transliteration: "As-Samad", meaning: "The Eternal", meaningUrdu: "بے نیاز" },
  { number: 69, arabic: "الْقَادِرُ", transliteration: "Al-Qadir", meaning: "The Able", meaningUrdu: "قادر" },
  { number: 70, arabic: "الْمُقْتَدِرُ", transliteration: "Al-Muqtadir", meaning: "The Powerful", meaningUrdu: "طاقت والا" },
  { number: 71, arabic: "الْمُقَدِّمُ", transliteration: "Al-Muqaddim", meaning: "The Expediter", meaningUrdu: "آگے کرنے والا" },
  { number: 72, arabic: "الْمُؤَخِّرُ", transliteration: "Al-Mu'akhkhir", meaning: "The Delayer", meaningUrdu: "پیچھے کرنے والا" },
  { number: 73, arabic: "الأوَّلُ", transliteration: "Al-Awwal", meaning: "The First", meaningUrdu: "پہلا" },
  { number: 74, arabic: "الآخِرُ", transliteration: "Al-Akhir", meaning: "The Last", meaningUrdu: "آخری" },
  { number: 75, arabic: "الظَّاهِرُ", transliteration: "Az-Zahir", meaning: "The Manifest", meaningUrdu: "ظاہر" },
  { number: 76, arabic: "الْبَاطِنُ", transliteration: "Al-Batin", meaning: "The Hidden", meaningUrdu: "چھپا ہوا" },
  { number: 77, arabic: "الْوَالِي", transliteration: "Al-Wali", meaning: "The Governor", meaningUrdu: "والی" },
  { number: 78, arabic: "الْمُتَعَالِي", transliteration: "Al-Muta'ali", meaning: "The Most Exalted", meaningUrdu: "بلند" },
  { number: 79, arabic: "الْبَرُّ", transliteration: "Al-Barr", meaning: "The Source of Goodness", meaningUrdu: "نیکی کرنے والا" },
  { number: 80, arabic: "التَّوَّابُ", transliteration: "At-Tawwab", meaning: "The Acceptor of Repentance", meaningUrdu: "توبہ قبول کرنے والا" },
  { number: 81, arabic: "الْمُنْتَقِمُ", transliteration: "Al-Muntaqim", meaning: "The Avenger", meaningUrdu: "بدلہ لینے والا" },
  { number: 82, arabic: "العَفُوُّ", transliteration: "Al-Afuww", meaning: "The Pardoner", meaningUrdu: "معاف کرنے والا" },
  { number: 83, arabic: "الرَّؤُوفُ", transliteration: "Ar-Ra'uf", meaning: "The Compassionate", meaningUrdu: "شفقت کرنے والا" },
  { number: 84, arabic: "مَالِكُ الْمُلْكِ", transliteration: "Malik-ul-Mulk", meaning: "Owner of Sovereignty", meaningUrdu: "بادشاہی کا مالک" },
  { number: 85, arabic: "ذُوالْجَلاَلِ وَالإكْرَامِ", transliteration: "Dhul-Jalali wal-Ikram", meaning: "Lord of Majesty and Bounty", meaningUrdu: "جلال اور عزت والا" },
  { number: 86, arabic: "الْمُقْسِطُ", transliteration: "Al-Muqsit", meaning: "The Equitable", meaningUrdu: "انصاف کرنے والا" },
  { number: 87, arabic: "الْجَامِعُ", transliteration: "Al-Jami", meaning: "The Gatherer", meaningUrdu: "جمع کرنے والا" },
  { number: 88, arabic: "الْغَنِيُّ", transliteration: "Al-Ghani", meaning: "The Self-Sufficient", meaningUrdu: "بے نیاز" },
  { number: 89, arabic: "الْمُغْنِي", transliteration: "Al-Mughni", meaning: "The Enricher", meaningUrdu: "غنی کرنے والا" },
  { number: 90, arabic: "اَلْمَانِعُ", transliteration: "Al-Mani", meaning: "The Preventer", meaningUrdu: "روکنے والا" },
  { number: 91, arabic: "الضَّارَّ", transliteration: "Ad-Darr", meaning: "The Distresser", meaningUrdu: "نقصان پہنچانے والا" },
  { number: 92, arabic: "النَّافِعُ", transliteration: "An-Nafi", meaning: "The Benefactor", meaningUrdu: "فائدہ پہنچانے والا" },
  { number: 93, arabic: "النُّورُ", transliteration: "An-Nur", meaning: "The Light", meaningUrdu: "نور" },
  { number: 94, arabic: "الْهَادِي", transliteration: "Al-Hadi", meaning: "The Guide", meaningUrdu: "ہدایت دینے والا" },
  { number: 95, arabic: "الْبَدِيعُ", transliteration: "Al-Badi", meaning: "The Incomparable", meaningUrdu: "انوکھا پیدا کرنے والا" },
  { number: 96, arabic: "اَلْبَاقِي", transliteration: "Al-Baqi", meaning: "The Everlasting", meaningUrdu: "باقی رہنے والا" },
  { number: 97, arabic: "الْوَارِثُ", transliteration: "Al-Warith", meaning: "The Inheritor", meaningUrdu: "وارث" },
  { number: 98, arabic: "الرَّشِيدُ", transliteration: "Ar-Rashid", meaning: "The Guide to the Right Path", meaningUrdu: "سیدھا راستہ دکھانے والا" },
  { number: 99, arabic: "الصَّبُورُ", transliteration: "As-Sabur", meaning: "The Patient", meaningUrdu: "صبر کرنے والا" },
];

const NamesOfAllahPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingName, setPlayingName] = useState<number | null>(null);
  const [loadingName, setLoadingName] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t, language } = useLanguage();

  const playNameAudio = async (number: number, arabic: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (playingName === number) {
      setPlayingName(null);
      return;
    }

    setLoadingName(number);
    setPlayingName(null);

    try {
      const response = await supabase.functions.invoke('elevenlabs-kalmas-tts', {
        body: { text: arabic }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data?.audioContent) {
        throw new Error("No audio content");
      }

      const audioUrl = `data:audio/mpeg;base64,${response.data.audioContent}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingName(null);
        audioRef.current = null;
      };

      audio.onerror = () => {
        toast.error(language === "ur" ? "آڈیو چلانے میں خرابی" : "Error playing audio");
        setPlayingName(null);
        audioRef.current = null;
      };

      await audio.play();
      setPlayingName(number);
    } catch (error) {
      console.error("Error playing audio:", error);
      toast.error(language === "ur" ? "آڈیو دستیاب نہیں" : "Audio not available");
    } finally {
      setLoadingName(null);
    }
  };

  const handleFavorite = (name: typeof namesOfAllah[0]) => {
    const id = `name-${name.number}`;
    toggleFavorite({
      id,
      type: "name",
      title: name.transliteration,
      arabic: name.arabic,
      transliteration: name.transliteration,
      meaning: name.meaning,
    });
    toast.success(isFavorite(id) 
      ? (language === "ur" ? "پسندیدہ سے ہٹا دیا گیا" : "Removed from favorites") 
      : (language === "ur" ? "پسندیدہ میں شامل ہو گیا" : "Added to favorites"));
  };

  const filteredNames = namesOfAllah.filter(
    (name) =>
      name.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.arabic.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("page.names")}</h1>
            <p className="text-xs text-muted-foreground font-arabic">{t("page.namesArabic")}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("names.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Names Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {filteredNames.map((name, index) => (
            <Card
              key={name.number}
              className="group p-6 bg-card border-border/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary-foreground/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary group-hover:text-gold transition-colors">
                    {name.number}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playNameAudio(name.number, name.arabic);
                    }}
                    className="p-1.5 rounded-full hover:bg-primary-foreground/10 transition-colors"
                    aria-label="Play pronunciation"
                    disabled={loadingName === name.number}
                  >
                    {loadingName === name.number ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    ) : playingName === name.number ? (
                      <Pause className="w-4 h-4 text-primary" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite(name);
                    }}
                    className="p-1.5 rounded-full hover:bg-primary-foreground/10 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite(`name-${name.number}`) ? "text-red-500 fill-red-500" : "text-gold opacity-0 group-hover:opacity-100"} transition-opacity`} />
                  </button>
                </div>
              </div>

              <p className="text-3xl font-arabic text-foreground group-hover:text-primary-foreground text-center mb-3 leading-relaxed" dir="rtl">
                {name.arabic}
              </p>

              <p className="text-lg font-semibold text-gold group-hover:text-gold-light text-center mb-1 transition-colors">
                {name.transliteration}
              </p>

              <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/80 text-center transition-colors">
                {language === "ur" ? name.meaningUrdu : name.meaning}
              </p>
            </Card>
          ))}
        </div>

        {filteredNames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("names.noResults")} "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NamesOfAllahPage;
