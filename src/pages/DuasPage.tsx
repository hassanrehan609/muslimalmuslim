import { Link } from "react-router-dom";
import { ArrowLeft, Sun, Moon, Utensils, Bed, Heart, BookOpen, Sunrise, Cloud } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const duaCategories = [
  {
    id: "morning",
    name: "Morning",
    nameUrdu: "صبح",
    arabic: "أذكار الصباح",
    icon: Sunrise,
    duas: [
      {
        title: "Morning Remembrance",
        titleUrdu: "صبح کا ذکر",
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
        transliteration: "Asbahnaa wa asbahal mulku lillah, walhamdulillah",
        translation: "We have reached the morning and at this very time the whole kingdom belongs to Allah. All praise is due to Allah.",
        translationUrdu: "ہم نے صبح کی اور اسی وقت تمام بادشاہت اللہ کے لیے ہے۔ تمام تعریفیں اللہ کے لیے ہیں۔",
      },
      {
        title: "Seeking Protection",
        titleUrdu: "حفاظت کی دعا",
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
        transliteration: "Allahumma bika asbahnaa, wa bika amsaynaa, wa bika nahyaa, wa bika namootu wa ilaykan-nushoor",
        translation: "O Allah, by Your leave we have reached the morning, by Your leave we have reached the evening. By Your leave we live and die and unto You is our resurrection.",
        translationUrdu: "اے اللہ، تیری مرضی سے ہم نے صبح کی، تیری مرضی سے شام کی۔ تیری مرضی سے ہم جیتے ہیں اور تیری مرضی سے مرتے ہیں اور تیری طرف لوٹنا ہے۔",
      },
      {
        title: "Master of Forgiveness",
        titleUrdu: "سید الاستغفار",
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ",
        transliteration: "Allahumma anta Rabbi la ilaha illa anta, Khalaqtani wa ana abduka",
        translation: "O Allah, You are my Lord. There is no god but You. You created me and I am Your servant.",
        translationUrdu: "اے اللہ، تو میرا رب ہے۔ تیرے سوا کوئی معبود نہیں۔ تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں۔",
      },
    ],
  },
  {
    id: "evening",
    name: "Evening",
    nameUrdu: "شام",
    arabic: "أذكار المساء",
    icon: Moon,
    duas: [
      {
        title: "Evening Remembrance",
        titleUrdu: "شام کا ذکر",
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
        transliteration: "Amsayna wa amsal mulku lillah, walhamdulillah",
        translation: "We have reached the evening and at this very time the whole kingdom belongs to Allah. All praise is due to Allah.",
        translationUrdu: "ہم نے شام کی اور اسی وقت تمام بادشاہت اللہ کے لیے ہے۔ تمام تعریفیں اللہ کے لیے ہیں۔",
      },
      {
        title: "Seeking Refuge",
        titleUrdu: "پناہ کی دعا",
        arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        transliteration: "A'oodhu bikalimaatillaahit-taammaati min sharri maa khalaq",
        translation: "I seek refuge in the perfect words of Allah from the evil of that which He has created.",
        translationUrdu: "میں اللہ کے کامل کلمات کی پناہ مانگتا ہوں اس کی مخلوق کی شر سے۔",
      },
    ],
  },
  {
    id: "sleeping",
    name: "Before Sleeping",
    nameUrdu: "سونے سے پہلے",
    arabic: "أذكار النوم",
    icon: Bed,
    duas: [
      {
        title: "Before Sleep",
        titleUrdu: "سونے سے پہلے",
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amootu wa ahya",
        translation: "In Your name O Allah, I die and I live.",
        translationUrdu: "اے اللہ تیرے نام سے میں مرتا ہوں اور جیتا ہوں۔",
      },
      {
        title: "Complete Protection",
        titleUrdu: "مکمل حفاظت",
        arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        transliteration: "Allahumma qini 'adhaabaka yawma tab'athu 'ibaadaka",
        translation: "O Allah, protect me from Your punishment on the day You resurrect Your servants.",
        translationUrdu: "اے اللہ مجھے اپنے عذاب سے بچا اس دن جب تو اپنے بندوں کو اٹھائے گا۔",
      },
      {
        title: "Ayatul Kursi",
        titleUrdu: "آیت الکرسی",
        arabic: "اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ",
        transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum",
        translation: "Allah! There is no god but He, the Living, the Self-subsisting, Eternal.",
        translationUrdu: "اللہ! اس کے سوا کوئی معبود نہیں، وہ زندہ ہے، سب کا سہارا ہے۔",
      },
    ],
  },
  {
    id: "food",
    name: "Food & Eating",
    nameUrdu: "کھانا پینا",
    arabic: "أذكار الطعام",
    icon: Utensils,
    duas: [
      {
        title: "Before Eating",
        titleUrdu: "کھانے سے پہلے",
        arabic: "بِسْمِ اللَّهِ",
        transliteration: "Bismillah",
        translation: "In the name of Allah.",
        translationUrdu: "اللہ کے نام سے۔",
      },
      {
        title: "After Eating",
        titleUrdu: "کھانے کے بعد",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلاَ قُوَّةٍ",
        transliteration: "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwatin",
        translation: "All praise is due to Allah Who fed me this and provided it for me without any might or power from me.",
        translationUrdu: "تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کھلایا اور بغیر میری طاقت کے مجھے رزق دیا۔",
      },
      {
        title: "When Breaking Fast",
        titleUrdu: "روزہ کھولتے وقت",
        arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
        transliteration: "Dhahaba al-zama'u wabtallatil-'urooqu wa thabatal-ajru insha'Allah",
        translation: "Thirst has gone, the veins are moist, and the reward is confirmed, if Allah wills.",
        translationUrdu: "پیاس ختم ہوئی، رگیں تر ہوئیں، اور ان شاء اللہ اجر ثابت ہوا۔",
      },
    ],
  },
  {
    id: "daily",
    name: "Daily Life",
    nameUrdu: "روزمرہ زندگی",
    arabic: "أذكار يومية",
    icon: Sun,
    duas: [
      {
        title: "Entering Home",
        titleUrdu: "گھر میں داخل ہوتے وقت",
        arabic: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
        transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Allahi rabbina tawakkalna",
        translation: "In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we depend.",
        translationUrdu: "اللہ کے نام سے ہم داخل ہوتے ہیں، اللہ کے نام سے نکلتے ہیں، اور اپنے رب پر بھروسہ کرتے ہیں۔",
      },
      {
        title: "Leaving Home",
        titleUrdu: "گھر سے نکلتے وقت",
        arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ",
        transliteration: "Bismillahi tawakkaltu 'ala Allah, wa la hawla wa la quwwata illa billah",
        translation: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
        translationUrdu: "اللہ کے نام سے، میں اللہ پر بھروسہ کرتا ہوں، اللہ کے سوا کوئی طاقت نہیں۔",
      },
      {
        title: "When Wearing Clothes",
        titleUrdu: "کپڑے پہنتے وقت",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلاَ قُوَّةٍ",
        transliteration: "Alhamdulillahil-ladhi kasani hadha wa razaqanihi min ghayri hawlin minni wa la quwwatin",
        translation: "All praise is due to Allah Who has clothed me with this and provided it for me without any power or might from me.",
        translationUrdu: "تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ پہنایا اور بغیر میری طاقت کے عطا فرمایا۔",
      },
    ],
  },
  {
    id: "protection",
    name: "Protection",
    nameUrdu: "حفاظت",
    arabic: "أذكار الحماية",
    icon: Heart,
    duas: [
      {
        title: "Protection from Evil",
        titleUrdu: "شر سے حفاظت",
        arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        transliteration: "A'udhu billahi minash-shaytanir-rajim",
        translation: "I seek refuge in Allah from the accursed Satan.",
        translationUrdu: "میں شیطان مردود سے اللہ کی پناہ مانگتا ہوں۔",
      },
      {
        title: "Protection from Harm",
        titleUrdu: "نقصان سے حفاظت",
        arabic: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim",
        translation: "In the name of Allah, with Whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, All-Knowing.",
        translationUrdu: "اللہ کے نام سے جس کے نام کے ساتھ زمین و آسمان میں کوئی چیز نقصان نہیں دے سکتی، وہ سننے والا، جاننے والا ہے۔",
      },
    ],
  },
];

const DuasPage = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t, language } = useLanguage();

  const handleFavorite = (dua: typeof duaCategories[0]["duas"][0], categoryName: string) => {
    const id = `dua-${dua.title.replace(/\s+/g, "-").toLowerCase()}`;
    toggleFavorite({
      id,
      type: "dua",
      title: dua.title,
      arabic: dua.arabic,
      transliteration: dua.transliteration,
      translation: dua.translation,
      category: categoryName,
    });
    toast.success(isFavorite(id) 
      ? (language === "ur" ? "پسندیدہ سے ہٹا دیا گیا" : "Removed from favorites") 
      : (language === "ur" ? "پسندیدہ میں شامل ہو گیا" : "Added to favorites"));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("page.duas")}</h1>
            <p className="text-xs text-muted-foreground font-arabic">{t("page.duasArabic")}</p>
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
                  <span className="hidden sm:inline">{language === "ur" ? category.nameUrdu : category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {duaCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="text-center mb-8">
                <p className="text-gold font-arabic text-2xl mb-2">{category.arabic}</p>
                <h2 className="text-2xl font-bold text-foreground">
                  {language === "ur" ? category.nameUrdu : category.name} {language === "ur" ? "کی دعائیں" : "Duas"}
                </h2>
              </div>

              <div className="space-y-6 max-w-3xl mx-auto">
                {category.duas.map((dua, index) => {
                  const favoriteId = `dua-${dua.title.replace(/\s+/g, "-").toLowerCase()}`;
                  return (
                  <Card key={index} className="p-6 bg-card border-border/50 hover:shadow-elevated transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        {language === "ur" ? dua.titleUrdu : dua.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFavorite(dua, category.name)}
                        className="h-9 w-9"
                      >
                        <Heart className={`w-5 h-5 ${isFavorite(favoriteId) ? "text-red-500 fill-red-500" : "text-muted-foreground"}`} />
                      </Button>
                    </div>
                    
                    <div className="bg-primary/5 rounded-xl p-6 mb-4">
                      <p className="text-2xl md:text-3xl font-arabic text-foreground text-center leading-loose" dir="rtl">
                        {dua.arabic}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gold uppercase tracking-wide mb-1">{t("duas.transliteration")}</p>
                        <p className="text-muted-foreground italic">{dua.transliteration}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gold uppercase tracking-wide mb-1">{t("duas.translation")}</p>
                        <p className="text-foreground">{language === "ur" ? dua.translationUrdu : dua.translation}</p>
                      </div>
                    </div>
                  </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default DuasPage;
