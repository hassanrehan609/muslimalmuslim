import { Link } from "react-router-dom";
import { ArrowLeft, Sun, Moon, Utensils, Bed, Heart, BookOpen, Sunrise, Cloud } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const duaCategories = [
  {
    id: "morning",
    name: "Morning",
    arabic: "أذكار الصباح",
    icon: Sunrise,
    duas: [
      {
        title: "Morning Remembrance",
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
        transliteration: "Asbahnaa wa asbahal mulku lillah, walhamdulillah",
        translation: "We have reached the morning and at this very time the whole kingdom belongs to Allah. All praise is due to Allah.",
      },
      {
        title: "Seeking Protection",
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
        transliteration: "Allahumma bika asbahnaa, wa bika amsaynaa, wa bika nahyaa, wa bika namootu wa ilaykan-nushoor",
        translation: "O Allah, by Your leave we have reached the morning, by Your leave we have reached the evening. By Your leave we live and die and unto You is our resurrection.",
      },
      {
        title: "Master of Forgiveness",
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ",
        transliteration: "Allahumma anta Rabbi la ilaha illa anta, Khalaqtani wa ana abduka",
        translation: "O Allah, You are my Lord. There is no god but You. You created me and I am Your servant.",
      },
    ],
  },
  {
    id: "evening",
    name: "Evening",
    arabic: "أذكار المساء",
    icon: Moon,
    duas: [
      {
        title: "Evening Remembrance",
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
        transliteration: "Amsayna wa amsal mulku lillah, walhamdulillah",
        translation: "We have reached the evening and at this very time the whole kingdom belongs to Allah. All praise is due to Allah.",
      },
      {
        title: "Seeking Refuge",
        arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        transliteration: "A'oodhu bikalimaatillaahit-taammaati min sharri maa khalaq",
        translation: "I seek refuge in the perfect words of Allah from the evil of that which He has created.",
      },
    ],
  },
  {
    id: "sleeping",
    name: "Before Sleeping",
    arabic: "أذكار النوم",
    icon: Bed,
    duas: [
      {
        title: "Before Sleep",
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amootu wa ahya",
        translation: "In Your name O Allah, I die and I live.",
      },
      {
        title: "Complete Protection",
        arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        transliteration: "Allahumma qini 'adhaabaka yawma tab'athu 'ibaadaka",
        translation: "O Allah, protect me from Your punishment on the day You resurrect Your servants.",
      },
      {
        title: "Ayatul Kursi",
        arabic: "اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ",
        transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum",
        translation: "Allah! There is no god but He, the Living, the Self-subsisting, Eternal.",
      },
    ],
  },
  {
    id: "food",
    name: "Food & Eating",
    arabic: "أذكار الطعام",
    icon: Utensils,
    duas: [
      {
        title: "Before Eating",
        arabic: "بِسْمِ اللَّهِ",
        transliteration: "Bismillah",
        translation: "In the name of Allah.",
      },
      {
        title: "After Eating",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلاَ قُوَّةٍ",
        transliteration: "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwatin",
        translation: "All praise is due to Allah Who fed me this and provided it for me without any might or power from me.",
      },
      {
        title: "When Breaking Fast",
        arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
        transliteration: "Dhahaba al-zama'u wabtallatil-'urooqu wa thabatal-ajru insha'Allah",
        translation: "Thirst has gone, the veins are moist, and the reward is confirmed, if Allah wills.",
      },
    ],
  },
  {
    id: "daily",
    name: "Daily Life",
    arabic: "أذكار يومية",
    icon: Sun,
    duas: [
      {
        title: "Entering Home",
        arabic: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
        transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Allahi rabbina tawakkalna",
        translation: "In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we depend.",
      },
      {
        title: "Leaving Home",
        arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ",
        transliteration: "Bismillahi tawakkaltu 'ala Allah, wa la hawla wa la quwwata illa billah",
        translation: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
      },
      {
        title: "When Wearing Clothes",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلاَ قُوَّةٍ",
        transliteration: "Alhamdulillahil-ladhi kasani hadha wa razaqanihi min ghayri hawlin minni wa la quwwatin",
        translation: "All praise is due to Allah Who has clothed me with this and provided it for me without any power or might from me.",
      },
    ],
  },
  {
    id: "protection",
    name: "Protection",
    arabic: "أذكار الحماية",
    icon: Heart,
    duas: [
      {
        title: "Protection from Evil",
        arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        transliteration: "A'udhu billahi minash-shaytanir-rajim",
        translation: "I seek refuge in Allah from the accursed Satan.",
      },
      {
        title: "Protection from Harm",
        arabic: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim",
        translation: "In the name of Allah, with Whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, All-Knowing.",
      },
    ],
  },
];

const DuasPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Daily Duas</h1>
            <p className="text-xs text-muted-foreground font-arabic">الأدعية اليومية</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="morning" className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent mb-8">
            {duaCategories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {duaCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="text-center mb-8">
                <p className="text-gold font-arabic text-2xl mb-2">{category.arabic}</p>
                <h2 className="text-2xl font-bold text-foreground">{category.name} Duas</h2>
              </div>

              <div className="space-y-6 max-w-3xl mx-auto">
                {category.duas.map((dua, index) => (
                  <Card key={index} className="p-6 bg-card border-border/50 hover:shadow-elevated transition-shadow">
                    <h3 className="text-lg font-semibold text-foreground mb-4">{dua.title}</h3>
                    
                    <div className="bg-primary/5 rounded-xl p-6 mb-4">
                      <p className="text-2xl md:text-3xl font-arabic text-foreground text-center leading-loose" dir="rtl">
                        {dua.arabic}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gold uppercase tracking-wide mb-1">Transliteration</p>
                        <p className="text-muted-foreground italic">{dua.transliteration}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gold uppercase tracking-wide mb-1">Translation</p>
                        <p className="text-foreground">{dua.translation}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default DuasPage;
