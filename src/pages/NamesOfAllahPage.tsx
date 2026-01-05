import { Link } from "react-router-dom";
import { ArrowLeft, Search, Heart, Play, Pause, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";

// Audio URLs for each name (using islamcan.com audio)
const getNameAudioUrl = (number: number): string => {
  return `https://www.islamcan.com/audio/99-names-of-allah/${number.toString().padStart(2, '0')}.mp3`;
};

const namesOfAllah = [
  { number: 1, arabic: "الرَّحْمَنُ", transliteration: "Ar-Rahman", meaning: "The Most Gracious" },
  { number: 2, arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: "The Most Merciful" },
  { number: 3, arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King" },
  { number: 4, arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaning: "The Most Holy" },
  { number: 5, arabic: "السَّلاَمُ", transliteration: "As-Salam", meaning: "The Source of Peace" },
  { number: 6, arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", meaning: "The Guardian of Faith" },
  { number: 7, arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaning: "The Protector" },
  { number: 8, arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", meaning: "The Almighty" },
  { number: 9, arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", meaning: "The Compeller" },
  { number: 10, arabic: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", meaning: "The Supreme" },
  { number: 11, arabic: "الْخَالِقُ", transliteration: "Al-Khaliq", meaning: "The Creator" },
  { number: 12, arabic: "الْبَارِئُ", transliteration: "Al-Bari", meaning: "The Evolver" },
  { number: 13, arabic: "الْمُصَوِّرُ", transliteration: "Al-Musawwir", meaning: "The Fashioner" },
  { number: 14, arabic: "الْغَفَّارُ", transliteration: "Al-Ghaffar", meaning: "The Forgiver" },
  { number: 15, arabic: "الْقَهَّارُ", transliteration: "Al-Qahhar", meaning: "The Subduer" },
  { number: 16, arabic: "الْوَهَّابُ", transliteration: "Al-Wahhab", meaning: "The Bestower" },
  { number: 17, arabic: "الرَّزَّاقُ", transliteration: "Ar-Razzaq", meaning: "The Provider" },
  { number: 18, arabic: "الْفَتَّاحُ", transliteration: "Al-Fattah", meaning: "The Opener" },
  { number: 19, arabic: "اَلْعَلِيْمُ", transliteration: "Al-Alim", meaning: "The All-Knowing" },
  { number: 20, arabic: "الْقَابِضُ", transliteration: "Al-Qabid", meaning: "The Restrainer" },
  { number: 21, arabic: "الْبَاسِطُ", transliteration: "Al-Basit", meaning: "The Expander" },
  { number: 22, arabic: "الْخَافِضُ", transliteration: "Al-Khafid", meaning: "The Abaser" },
  { number: 23, arabic: "الرَّافِعُ", transliteration: "Ar-Rafi", meaning: "The Exalter" },
  { number: 24, arabic: "الْمُعِزُّ", transliteration: "Al-Mu'izz", meaning: "The Bestower of Honor" },
  { number: 25, arabic: "المُذِلُّ", transliteration: "Al-Mudhill", meaning: "The Humiliator" },
  { number: 26, arabic: "السَّمِيعُ", transliteration: "As-Sami", meaning: "The All-Hearing" },
  { number: 27, arabic: "الْبَصِيرُ", transliteration: "Al-Basir", meaning: "The All-Seeing" },
  { number: 28, arabic: "الْحَكَمُ", transliteration: "Al-Hakam", meaning: "The Judge" },
  { number: 29, arabic: "الْعَدْلُ", transliteration: "Al-Adl", meaning: "The Just" },
  { number: 30, arabic: "اللَّطِيفُ", transliteration: "Al-Latif", meaning: "The Subtle One" },
  { number: 31, arabic: "الْخَبِيرُ", transliteration: "Al-Khabir", meaning: "The All-Aware" },
  { number: 32, arabic: "الْحَلِيمُ", transliteration: "Al-Halim", meaning: "The Forbearing" },
  { number: 33, arabic: "الْعَظِيمُ", transliteration: "Al-Azim", meaning: "The Magnificent" },
  { number: 34, arabic: "الْغَفُورُ", transliteration: "Al-Ghafur", meaning: "The Forgiving" },
  { number: 35, arabic: "الشَّكُورُ", transliteration: "Ash-Shakur", meaning: "The Appreciative" },
  { number: 36, arabic: "الْعَلِيُّ", transliteration: "Al-Ali", meaning: "The Most High" },
  { number: 37, arabic: "الْكَبِيرُ", transliteration: "Al-Kabir", meaning: "The Greatest" },
  { number: 38, arabic: "الْحَفِيظُ", transliteration: "Al-Hafiz", meaning: "The Preserver" },
  { number: 39, arabic: "المُقيِت", transliteration: "Al-Muqit", meaning: "The Nourisher" },
  { number: 40, arabic: "الْحسِيبُ", transliteration: "Al-Hasib", meaning: "The Reckoner" },
  { number: 41, arabic: "الْجَلِيلُ", transliteration: "Al-Jalil", meaning: "The Majestic" },
  { number: 42, arabic: "الْكَرِيمُ", transliteration: "Al-Karim", meaning: "The Generous" },
  { number: 43, arabic: "الرَّقِيبُ", transliteration: "Ar-Raqib", meaning: "The Watchful" },
  { number: 44, arabic: "الْمُجِيبُ", transliteration: "Al-Mujib", meaning: "The Responsive" },
  { number: 45, arabic: "الْوَاسِعُ", transliteration: "Al-Wasi", meaning: "The All-Encompassing" },
  { number: 46, arabic: "الْحَكِيمُ", transliteration: "Al-Hakim", meaning: "The Wise" },
  { number: 47, arabic: "الْوَدُودُ", transliteration: "Al-Wadud", meaning: "The Loving" },
  { number: 48, arabic: "الْمَجِيدُ", transliteration: "Al-Majid", meaning: "The Glorious" },
  { number: 49, arabic: "الْبَاعِثُ", transliteration: "Al-Ba'ith", meaning: "The Resurrector" },
  { number: 50, arabic: "الشَّهِيدُ", transliteration: "Ash-Shahid", meaning: "The Witness" },
  { number: 51, arabic: "الْحَقُّ", transliteration: "Al-Haqq", meaning: "The Truth" },
  { number: 52, arabic: "الْوَكِيلُ", transliteration: "Al-Wakil", meaning: "The Trustee" },
  { number: 53, arabic: "الْقَوِيُّ", transliteration: "Al-Qawiyy", meaning: "The Strong" },
  { number: 54, arabic: "الْمَتِينُ", transliteration: "Al-Matin", meaning: "The Firm" },
  { number: 55, arabic: "الْوَلِيُّ", transliteration: "Al-Waliyy", meaning: "The Protecting Friend" },
  { number: 56, arabic: "الْحَمِيدُ", transliteration: "Al-Hamid", meaning: "The Praiseworthy" },
  { number: 57, arabic: "الْمُحْصِي", transliteration: "Al-Muhsi", meaning: "The Counter" },
  { number: 58, arabic: "الْمُبْدِئُ", transliteration: "Al-Mubdi", meaning: "The Originator" },
  { number: 59, arabic: "الْمُعِيدُ", transliteration: "Al-Mu'id", meaning: "The Restorer" },
  { number: 60, arabic: "الْمُحْيِي", transliteration: "Al-Muhyi", meaning: "The Giver of Life" },
  { number: 61, arabic: "اَلْمُمِيتُ", transliteration: "Al-Mumit", meaning: "The Giver of Death" },
  { number: 62, arabic: "الْحَيُّ", transliteration: "Al-Hayy", meaning: "The Ever-Living" },
  { number: 63, arabic: "الْقَيُّومُ", transliteration: "Al-Qayyum", meaning: "The Self-Subsisting" },
  { number: 64, arabic: "الْوَاجِدُ", transliteration: "Al-Wajid", meaning: "The Finder" },
  { number: 65, arabic: "الْمَاجِدُ", transliteration: "Al-Majid", meaning: "The Noble" },
  { number: 66, arabic: "الْواحِدُ", transliteration: "Al-Wahid", meaning: "The One" },
  { number: 67, arabic: "اَلاَحَدُ", transliteration: "Al-Ahad", meaning: "The Unique" },
  { number: 68, arabic: "الصَّمَدُ", transliteration: "As-Samad", meaning: "The Eternal" },
  { number: 69, arabic: "الْقَادِرُ", transliteration: "Al-Qadir", meaning: "The Able" },
  { number: 70, arabic: "الْمُقْتَدِرُ", transliteration: "Al-Muqtadir", meaning: "The Powerful" },
  { number: 71, arabic: "الْمُقَدِّمُ", transliteration: "Al-Muqaddim", meaning: "The Expediter" },
  { number: 72, arabic: "الْمُؤَخِّرُ", transliteration: "Al-Mu'akhkhir", meaning: "The Delayer" },
  { number: 73, arabic: "الأوَّلُ", transliteration: "Al-Awwal", meaning: "The First" },
  { number: 74, arabic: "الآخِرُ", transliteration: "Al-Akhir", meaning: "The Last" },
  { number: 75, arabic: "الظَّاهِرُ", transliteration: "Az-Zahir", meaning: "The Manifest" },
  { number: 76, arabic: "الْبَاطِنُ", transliteration: "Al-Batin", meaning: "The Hidden" },
  { number: 77, arabic: "الْوَالِي", transliteration: "Al-Wali", meaning: "The Governor" },
  { number: 78, arabic: "الْمُتَعَالِي", transliteration: "Al-Muta'ali", meaning: "The Most Exalted" },
  { number: 79, arabic: "الْبَرُّ", transliteration: "Al-Barr", meaning: "The Source of Goodness" },
  { number: 80, arabic: "التَّوَّابُ", transliteration: "At-Tawwab", meaning: "The Acceptor of Repentance" },
  { number: 81, arabic: "الْمُنْتَقِمُ", transliteration: "Al-Muntaqim", meaning: "The Avenger" },
  { number: 82, arabic: "العَفُوُّ", transliteration: "Al-Afuww", meaning: "The Pardoner" },
  { number: 83, arabic: "الرَّؤُوفُ", transliteration: "Ar-Ra'uf", meaning: "The Compassionate" },
  { number: 84, arabic: "مَالِكُ الْمُلْكِ", transliteration: "Malik-ul-Mulk", meaning: "Owner of Sovereignty" },
  { number: 85, arabic: "ذُوالْجَلاَلِ وَالإكْرَامِ", transliteration: "Dhul-Jalali wal-Ikram", meaning: "Lord of Majesty and Bounty" },
  { number: 86, arabic: "الْمُقْسِطُ", transliteration: "Al-Muqsit", meaning: "The Equitable" },
  { number: 87, arabic: "الْجَامِعُ", transliteration: "Al-Jami", meaning: "The Gatherer" },
  { number: 88, arabic: "الْغَنِيُّ", transliteration: "Al-Ghani", meaning: "The Self-Sufficient" },
  { number: 89, arabic: "الْمُغْنِي", transliteration: "Al-Mughni", meaning: "The Enricher" },
  { number: 90, arabic: "اَلْمَانِعُ", transliteration: "Al-Mani", meaning: "The Preventer" },
  { number: 91, arabic: "الضَّارَّ", transliteration: "Ad-Darr", meaning: "The Distresser" },
  { number: 92, arabic: "النَّافِعُ", transliteration: "An-Nafi", meaning: "The Benefactor" },
  { number: 93, arabic: "النُّورُ", transliteration: "An-Nur", meaning: "The Light" },
  { number: 94, arabic: "الْهَادِي", transliteration: "Al-Hadi", meaning: "The Guide" },
  { number: 95, arabic: "الْبَدِيعُ", transliteration: "Al-Badi", meaning: "The Incomparable" },
  { number: 96, arabic: "اَلْبَاقِي", transliteration: "Al-Baqi", meaning: "The Everlasting" },
  { number: 97, arabic: "الْوَارِثُ", transliteration: "Al-Warith", meaning: "The Inheritor" },
  { number: 98, arabic: "الرَّشِيدُ", transliteration: "Ar-Rashid", meaning: "The Guide to the Right Path" },
  { number: 99, arabic: "الصَّبُورُ", transliteration: "As-Sabur", meaning: "The Patient" },
];

const NamesOfAllahPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingName, setPlayingName] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const playNameAudio = (number: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (playingName === number) {
      setPlayingName(null);
      return;
    }

    const audioUrl = getNameAudioUrl(number);
    audioRef.current = new Audio(audioUrl);
    audioRef.current.play().catch(() => {
      toast.error("Audio not available for this name");
      setPlayingName(null);
    });
    setPlayingName(number);
    
    audioRef.current.onended = () => {
      setPlayingName(null);
    };
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
    toast.success(isFavorite(id) ? "Removed from favorites" : "Added to favorites");
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
            <h1 className="text-xl font-bold text-foreground">99 Names of Allah</h1>
            <p className="text-xs text-muted-foreground font-arabic">أسماء الله الحسنى</p>
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
              placeholder="Search by name or meaning..."
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
                      playNameAudio(name.number);
                    }}
                    className="p-1.5 rounded-full hover:bg-primary-foreground/10 transition-colors"
                    aria-label="Play pronunciation"
                  >
                    {playingName === name.number ? (
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
                {name.meaning}
              </p>
            </Card>
          ))}
        </div>

        {filteredNames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No names found matching "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NamesOfAllahPage;
