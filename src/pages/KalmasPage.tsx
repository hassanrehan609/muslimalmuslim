import { ArrowLeft, Volume2, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useRef } from "react";

const kalmas = [
  {
    number: 1,
    name: "First Kalma (Tayyab)",
    arabic: "لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَسُولُ اللهِ",
    transliteration: "Lā ilāha illallāhu Muḥammadur Rasūlullāh",
    translation: "There is no God but Allah, Muhammad is the Messenger of Allah",
    meaning: "The Word of Purity - This kalma affirms the oneness of Allah and the prophethood of Muhammad ﷺ"
  },
  {
    number: 2,
    name: "Second Kalma (Shahadat)",
    arabic: "أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration: "Ash-hadu allā ilāha illallāhu waḥdahu lā sharīka lahu wa ash-hadu anna Muḥammadan ʿabduhu wa rasūluhu",
    translation: "I bear witness that there is no God but Allah, He is One and has no partner, and I bear witness that Muhammad is His servant and Messenger",
    meaning: "The Word of Testimony - A testimony of faith recited in prayers and when embracing Islam"
  },
  {
    number: 3,
    name: "Third Kalma (Tamjeed)",
    arabic: "سُبْحَانَ اللهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ",
    transliteration: "Subḥānallāhi walḥamdu lillāhi wa lā ilāha illallāhu wallāhu akbar. Wa lā ḥawla wa lā quwwata illā billāhil ʿAliyyil ʿAẓīm",
    translation: "Glory be to Allah, all praise is for Allah, there is no God but Allah, Allah is the Greatest. There is no power and no strength except with Allah, the Most High, the Most Great",
    meaning: "The Word of Glorification - Glorifies Allah and acknowledges His supreme power"
  },
  {
    number: 4,
    name: "Fourth Kalma (Tauheed)",
    arabic: "لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ أَبَدًا أَبَدًا ذُو الْجَلَالِ وَالْإِكْرَامِ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Lā ilāha illallāhu waḥdahu lā sharīka lahu, lahul mulku wa lahul ḥamdu yuḥyī wa yumītu wa huwa ḥayyun lā yamūtu abadan abadan dhul jalāli wal ikrām, biyadihil khayr wa huwa ʿalā kulli shay'in qadīr",
    translation: "There is no God but Allah, He is One, He has no partner. His is the Kingdom and for Him is all praise. He gives life and causes death. He is alive and will never die. Owner of Majesty and Honor, in His hand is all good and He has power over everything",
    meaning: "The Word of Unity - Emphasizes the absolute oneness and sovereignty of Allah"
  },
  {
    number: 5,
    name: "Fifth Kalma (Astaghfar)",
    arabic: "أَسْتَغْفِرُ اللهَ رَبِّي مِنْ كُلِّ ذَنْبٍ أَذْنَبْتُهُ عَمَدًا أَوْ خَطَأً سِرًّا أَوْ عَلَانِيَةً وَأَتُوبُ إِلَيْهِ مِنَ الذَّنْبِ الَّذِي أَعْلَمُ وَمِنَ الذَّنْبِ الَّذِي لَا أَعْلَمُ إِنَّكَ أَنْتَ عَلَّامُ الْغُيُوبِ وَسَتَّارُ الْعُيُوبِ وَغَفَّارُ الذُّنُوبِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ",
    transliteration: "Astaghfirullāha rabbī min kulli dhanbin adhnabtuhu ʿamadan aw khaṭa'an sirran aw ʿalāniyatan wa atūbu ilayhi minadh dhanbil ladhī aʿlamu wa minadh dhanbil ladhī lā aʿlam. Innaka anta ʿallāmul ghuyūbi wa sattārul ʿuyūbi wa ghaffārudh dhunūbi wa lā ḥawla wa lā quwwata illā billāhil ʿAliyyil ʿAẓīm",
    translation: "I seek forgiveness from Allah, my Lord, from every sin I committed knowingly or unknowingly, secretly or openly. I repent to Him from the sins I know and from the sins I do not know. Indeed You are the Knower of the hidden things and the Concealer of faults and the Forgiver of sins. There is no power and no strength except with Allah, the Most High, the Most Great",
    meaning: "The Word of Repentance - A prayer seeking forgiveness from Allah"
  },
  {
    number: 6,
    name: "Sixth Kalma (Radde Kufr)",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ أَنْ أُشْرِكَ بِكَ شَيْئًا وَأَنَا أَعْلَمُ بِهِ وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ بِهِ تُبْتُ عَنْهُ وَتَبَرَّأْتُ مِنَ الْكُفْرِ وَالشِّرْكِ وَالْكِذْبِ وَالْغِيبَةِ وَالْبِدْعَةِ وَالنَّمِيمَةِ وَالْفَوَاحِشِ وَالْبُهْتَانِ وَالْمَعَاصِي كُلِّهَا وَأَسْلَمْتُ وَأَقُولُ لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَسُولُ اللهِ",
    transliteration: "Allāhumma innī aʿūdhu bika min an ushrika bika shay'an wa ana aʿlamu bihi wa astaghfiruka limā lā aʿlamu bihi tubtu ʿanhu wa tabarrātu minal kufri wash shirki wal kidhibi wal ghībati wal bidʿati wan namīmati wal fawāḥishi wal buhtāni wal maʿāṣī kullihā wa aslamtu wa aqūlu lā ilāha illallāhu Muḥammadur Rasūlullāh",
    translation: "O Allah! I seek refuge in You from knowingly associating anything with You, and I seek Your forgiveness for that which I do not know. I repent from it and I free myself from disbelief, polytheism, lying, backbiting, innovation, slander, immorality, false accusations and all sins. I submit to Your will and I declare: There is no God but Allah, Muhammad is the Messenger of Allah",
    meaning: "The Word of Rejecting Disbelief - Renounces all forms of disbelief and sin"
  }
];

const KalmasPage = () => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const playArabic = (arabic: string, index: number) => {
    if (playingIndex === index) {
      window.speechSynthesis.cancel();
      setPlayingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(arabic);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.7;
    utterance.onend = () => setPlayingIndex(null);
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlayingIndex(index);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Six Kalmas</h1>
            <p className="text-sm text-primary-foreground/70 font-arabic">الکلمات الستة</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {kalmas.map((kalma, index) => (
            <Card key={kalma.number} className="p-6 bg-card border-border hover:border-gold/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold text-gold-foreground text-sm font-bold mb-2">
                    {kalma.number}
                  </span>
                  <h2 className="text-lg font-semibold text-foreground">{kalma.name}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => playArabic(kalma.arabic, index)}
                  className="text-gold hover:bg-gold/10"
                >
                  {playingIndex === index ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-2xl font-arabic text-gold leading-loose text-right">
                  {kalma.arabic}
                </p>
                <p className="text-muted-foreground italic">
                  {kalma.transliteration}
                </p>
                <p className="text-foreground">
                  <strong>Translation:</strong> {kalma.translation}
                </p>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <strong>Meaning:</strong> {kalma.meaning}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default KalmasPage;
