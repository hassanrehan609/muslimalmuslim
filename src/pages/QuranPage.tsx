import { Link } from "react-router-dom";
import { ArrowLeft, Search, Play, Pause, Heart, BookOpen, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Verse {
  number: number;
  text: string;
  numberInSurah: number;
  audio: string;
}

interface Translation {
  numberInSurah: number;
  text: string;
}

const QuranPage = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch("https://api.alquran.cloud/v1/surah");
        const data = await response.json();
        setSurahs(data.data);
      } catch (error) {
        console.error("Failed to fetch surahs:", error);
        toast.error("Failed to load Quran data");
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const fetchSurahDetails = async (surah: Surah) => {
    setLoadingVerses(true);
    setSelectedSurah(surah);
    try {
      const [arabicRes, translationRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/ar.alafasy`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/en.asad`),
      ]);
      
      const arabicData = await arabicRes.json();
      const translationData = await translationRes.json();
      
      setVerses(arabicData.data.ayahs);
      setTranslations(translationData.data.ayahs);
    } catch (error) {
      console.error("Failed to fetch surah details:", error);
      toast.error("Failed to load surah");
    } finally {
      setLoadingVerses(false);
    }
  };

  const playAudio = (verse: Verse) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (playingVerse === verse.numberInSurah) {
      setPlayingVerse(null);
      return;
    }

    audioRef.current = new Audio(verse.audio);
    audioRef.current.play();
    setPlayingVerse(verse.numberInSurah);
    
    audioRef.current.onended = () => {
      setPlayingVerse(null);
    };
  };

  const handleFavoriteVerse = (verse: Verse, translation: Translation) => {
    if (!selectedSurah) return;
    
    toggleFavorite({
      id: `verse-${selectedSurah.number}-${verse.numberInSurah}`,
      type: "verse",
      title: `${selectedSurah.englishName} ${verse.numberInSurah}`,
      arabic: verse.text,
      translation: translation.text,
      surahNumber: selectedSurah.number,
      verseNumber: verse.numberInSurah,
    });
    
    toast.success(
      isFavorite(`verse-${selectedSurah.number}-${verse.numberInSurah}`)
        ? "Removed from favorites"
        : "Added to favorites"
    );
  };

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString().includes(searchQuery)
  );

  if (selectedSurah) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="container mx-auto px-4 h-16 flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedSurah(null);
                setVerses([]);
                setTranslations([]);
                if (audioRef.current) audioRef.current.pause();
                setPlayingVerse(null);
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{selectedSurah.englishName}</h1>
              <p className="text-xs text-muted-foreground">{selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} verses</p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {loadingVerses ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Bismillah - except for Surah 9 */}
              {selectedSurah.number !== 9 && (
                <div className="text-center py-8 mb-6">
                  <p className="text-3xl font-arabic text-gold" dir="rtl">
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    In the name of Allah, the Most Gracious, the Most Merciful
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {verses.map((verse, index) => {
                  const translation = translations[index];
                  const favoriteId = `verse-${selectedSurah.number}-${verse.numberInSurah}`;
                  
                  return (
                    <Card key={verse.numberInSurah} className="p-6 bg-card border-border/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{verse.numberInSurah}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => playAudio(verse)}
                            className="h-10 w-10"
                          >
                            {playingVerse === verse.numberInSurah ? (
                              <Pause className="w-5 h-5 text-primary" />
                            ) : (
                              <Play className="w-5 h-5 text-muted-foreground" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleFavoriteVerse(verse, translation)}
                            className="h-10 w-10"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                isFavorite(favoriteId)
                                  ? "text-red-500 fill-red-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </Button>
                        </div>
                      </div>

                      <p className="text-2xl md:text-3xl font-arabic text-foreground text-right leading-loose mb-6" dir="rtl">
                        {verse.text}
                      </p>

                      <p className="text-muted-foreground leading-relaxed">
                        {translation?.text}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Holy Quran</h1>
            <p className="text-xs text-muted-foreground font-arabic">القرآن الكريم</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search surah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-3 max-w-3xl mx-auto">
            {filteredSurahs.map((surah) => (
              <Card
                key={surah.number}
                onClick={() => fetchSurahDetails(surah)}
                className="p-4 bg-card border-border/50 hover:bg-muted cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-primary">{surah.number}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{surah.englishName}</h3>
                      <p className="text-xl font-arabic text-gold" dir="rtl">{surah.name}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{surah.englishNameTranslation}</span>
                      <span>•</span>
                      <span>{surah.numberOfAyahs} verses</span>
                      <span>•</span>
                      <span className="capitalize">{surah.revelationType}</span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default QuranPage;
