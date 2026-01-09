import { ArrowLeft, ChevronRight, Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

const prayers = [
  { name: "Fajr", nameUrdu: "فجر", arabic: "الفجر", rakats: "2 Sunnah + 2 Fard", rakatsUrdu: "2 سنت + 2 فرض", time: "Before sunrise", timeUrdu: "طلوع آفتاب سے پہلے" },
  { name: "Dhuhr", nameUrdu: "ظہر", arabic: "الظهر", rakats: "4 Sunnah + 4 Fard + 2 Sunnah + 2 Nafl", rakatsUrdu: "4 سنت + 4 فرض + 2 سنت + 2 نفل", time: "After noon", timeUrdu: "دوپہر کے بعد" },
  { name: "Asr", nameUrdu: "عصر", arabic: "العصر", rakats: "4 Sunnah + 4 Fard", rakatsUrdu: "4 سنت + 4 فرض", time: "Afternoon", timeUrdu: "دوپہر بعد" },
  { name: "Maghrib", nameUrdu: "مغرب", arabic: "المغرب", rakats: "3 Fard + 2 Sunnah + 2 Nafl", rakatsUrdu: "3 فرض + 2 سنت + 2 نفل", time: "After sunset", timeUrdu: "غروب آفتاب کے بعد" },
  { name: "Isha", nameUrdu: "عشاء", arabic: "العشاء", rakats: "4 Sunnah + 4 Fard + 2 Sunnah + 2 Nafl + 3 Witr + 2 Nafl", rakatsUrdu: "4 سنت + 4 فرض + 2 سنت + 2 نفل + 3 وتر + 2 نفل", time: "Night", timeUrdu: "رات" },
];

const prayerSteps = [
  {
    step: 1,
    title: "Niyyah (Intention)",
    titleUrdu: "نیت",
    arabic: "نِيَّة",
    description: "Make intention in your heart for the specific prayer you are about to perform.",
    descriptionUrdu: "جو نماز پڑھنی ہو اس کی دل میں نیت کریں۔",
    details: "Stand facing the Qibla. Make a sincere intention in your heart. You don't need to say it out loud.",
    detailsUrdu: "قبلہ رخ کھڑے ہوں۔ دل میں سچی نیت کریں۔ زبان سے کہنا ضروری نہیں۔"
  },
  {
    step: 2,
    title: "Takbiratul Ihram",
    titleUrdu: "تکبیرِ تحریمہ",
    arabic: "تَكْبِيرَةُ الإِحْرَام",
    description: "Raise your hands to your ears and say 'Allahu Akbar'",
    descriptionUrdu: "ہاتھ کانوں تک اٹھائیں اور 'اللہ اکبر' کہیں",
    details: "Raise both hands to ear level with palms facing forward, fingers pointing up. Say 'Allahu Akbar' (Allah is the Greatest). This marks the beginning of your prayer.",
    detailsUrdu: "دونوں ہاتھ کانوں تک اٹھائیں، ہتھیلیاں سامنے اور انگلیاں اوپر کی طرف۔ 'اللہ اکبر' کہیں۔ یہ نماز کا آغاز ہے۔"
  },
  {
    step: 3,
    title: "Qiyam (Standing)",
    titleUrdu: "قیام",
    arabic: "قِيَام",
    description: "Place hands on chest, right over left. Recite Surah Al-Fatiha and another Surah.",
    descriptionUrdu: "ہاتھ سینے پر باندھیں، دایاں بائیں پر۔ سورۃ الفاتحہ اور کوئی سورۃ پڑھیں۔",
    details: "Place your right hand over your left on your chest. Recite Thana (opening supplication), then Surah Al-Fatiha, followed by another Surah or verses from the Quran.",
    detailsUrdu: "دایاں ہاتھ بائیں پر سینے پر رکھیں۔ ثناء پڑھیں، پھر سورۃ الفاتحہ، پھر کوئی سورۃ یا قرآنی آیات۔"
  },
  {
    step: 4,
    title: "Ruku (Bowing)",
    titleUrdu: "رکوع",
    arabic: "رُكُوع",
    description: "Bow down with hands on knees, back straight. Say 'Subhana Rabbiyal Azeem' 3 times.",
    descriptionUrdu: "جھکیں، ہاتھ گھٹنوں پر، کمر سیدھی۔ 'سبحان ربی العظیم' 3 بار کہیں۔",
    details: "Say 'Allahu Akbar' and bow. Place hands on knees, keep back straight and parallel to ground. Say 'Subhana Rabbiyal Azeem' (Glory to my Lord, the Great) at least 3 times.",
    detailsUrdu: "'اللہ اکبر' کہیں اور جھکیں۔ ہاتھ گھٹنوں پر رکھیں، کمر زمین کے متوازی۔ 'سبحان ربی العظیم' کم از کم 3 بار پڑھیں۔"
  },
  {
    step: 5,
    title: "Qawmah (Standing from Ruku)",
    titleUrdu: "قومہ",
    arabic: "قَوْمَة",
    description: "Rise from bowing saying 'Sami Allahu liman hamidah'",
    descriptionUrdu: "رکوع سے 'سمع اللہ لمن حمدہ' کہتے ہوئے اٹھیں",
    details: "Rise to standing position saying 'Sami Allahu liman hamidah' (Allah hears those who praise Him). Then say 'Rabbana lakal hamd' (Our Lord, to You belongs all praise).",
    detailsUrdu: "'سمع اللہ لمن حمدہ' کہتے ہوئے کھڑے ہوں۔ پھر 'ربنا لک الحمد' کہیں۔"
  },
  {
    step: 6,
    title: "First Sujud (Prostration)",
    titleUrdu: "پہلا سجدہ",
    arabic: "سُجُود",
    description: "Prostrate with forehead, nose, palms, knees, and toes touching the ground. Say 'Subhana Rabbiyal A'la' 3 times.",
    descriptionUrdu: "سجدہ کریں - پیشانی، ناک، ہتھیلیاں، گھٹنے اور پاؤں کی انگلیاں زمین پر۔ 'سبحان ربی الاعلیٰ' 3 بار کہیں۔",
    details: "Say 'Allahu Akbar' and go into prostration. Seven body parts should touch the ground: forehead with nose, both palms, both knees, and toes of both feet. Say 'Subhana Rabbiyal A'la' (Glory to my Lord, the Most High) at least 3 times.",
    detailsUrdu: "'اللہ اکبر' کہیں اور سجدے میں جائیں۔ سات اعضاء زمین کو لگیں: پیشانی ناک سمیت، دونوں ہتھیلیاں، دونوں گھٹنے، اور دونوں پاؤں کی انگلیاں۔ 'سبحان ربی الاعلیٰ' کم از کم 3 بار پڑھیں۔"
  },
  {
    step: 7,
    title: "Jalsah (Sitting between Sujud)",
    titleUrdu: "جلسہ",
    arabic: "جَلْسَة",
    description: "Sit briefly between the two prostrations saying 'Rabbighfirli'",
    descriptionUrdu: "دونوں سجدوں کے درمیان بیٹھیں 'رب اغفرلی' کہتے ہوئے",
    details: "Rise from prostration saying 'Allahu Akbar'. Sit on your left foot with right foot upright. Say 'Rabbighfirli' (O my Lord, forgive me) at least once.",
    detailsUrdu: "'اللہ اکبر' کہتے ہوئے سجدے سے اٹھیں۔ بائیں پاؤں پر بیٹھیں، دایاں کھڑا۔ 'رب اغفرلی' کم از کم ایک بار کہیں۔"
  },
  {
    step: 8,
    title: "Second Sujud",
    titleUrdu: "دوسرا سجدہ",
    arabic: "سُجُود",
    description: "Perform second prostration the same as the first.",
    descriptionUrdu: "دوسرا سجدہ پہلے کی طرح کریں۔",
    details: "Say 'Allahu Akbar' and prostrate again. Say 'Subhana Rabbiyal A'la' at least 3 times. This completes one Rakah.",
    detailsUrdu: "'اللہ اکبر' کہیں اور دوبارہ سجدہ کریں۔ 'سبحان ربی الاعلیٰ' کم از کم 3 بار پڑھیں۔ یہ ایک رکعت مکمل ہوئی۔"
  },
  {
    step: 9,
    title: "Tashahhud (Sitting)",
    titleUrdu: "تشہد",
    arabic: "التَّشَهُّد",
    description: "After 2 rakahs, sit and recite At-Tahiyyat.",
    descriptionUrdu: "2 رکعتوں کے بعد بیٹھیں اور التحیات پڑھیں۔",
    details: "Sit with left foot under you and right foot upright. Recite At-Tahiyyat. Point your index finger during the shahada.",
    detailsUrdu: "بائیں پاؤں پر بیٹھیں، دایاں کھڑا۔ التحیات پڑھیں۔ شہادت کے وقت شہادت کی انگلی سے اشارہ کریں۔"
  },
  {
    step: 10,
    title: "Salam (Ending)",
    titleUrdu: "سلام",
    arabic: "السَّلَام",
    description: "Turn head right then left saying 'Assalamu Alaikum wa Rahmatullah'",
    descriptionUrdu: "دائیں پھر بائیں سر پھیر کر 'السلام علیکم ورحمۃ اللہ' کہیں",
    details: "After the final sitting and Durood Ibrahim, turn your head to the right saying 'Assalamu Alaikum wa Rahmatullah', then to the left with the same greeting. This completes the prayer.",
    detailsUrdu: "آخری بیٹھک اور درود ابراہیم کے بعد، دائیں طرف سر پھیر کر 'السلام علیکم ورحمۃ اللہ' کہیں، پھر بائیں طرف۔ نماز مکمل۔"
  }
];

const essentialDuas = [
  {
    title: "Thana (Opening Supplication)",
    titleUrdu: "ثناء",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ",
    transliteration: "Subhanaka Allahumma wa bihamdika wa tabarakasmuka wa ta'ala jadduka wa la ilaha ghairuk",
    translation: "Glory be to You, O Allah, and praise be to You. Blessed is Your name and exalted is Your majesty. There is no god but You.",
    translationUrdu: "اے اللہ، تو پاک ہے اور تیری تعریف ہے۔ تیرا نام بابرکت ہے اور تیری شان بلند ہے۔ تیرے سوا کوئی معبود نہیں۔"
  },
  {
    title: "Surah Al-Fatiha",
    titleUrdu: "سورۃ الفاتحہ",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    transliteration: "Bismillahir Rahmanir Raheem. Alhamdu lillahi Rabbil 'aalameen. Ar-Rahmanir Raheem. Maaliki yawmid deen. Iyyaaka na'budu wa iyyaaka nasta'een. Ihdinas siraatal mustaqeem. Siraatal ladheena an'amta 'alaihim, ghairil maghdoobi 'alaihim wa lad daalleen. Ameen.",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful. All praise is for Allah, Lord of all worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgment. You alone we worship, and You alone we ask for help. Guide us on the Straight Path, the path of those who have received Your grace; not the path of those who have brought down wrath upon themselves, nor of those who have gone astray.",
    translationUrdu: "اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔ تمام تعریفیں اللہ کے لیے ہیں جو سارے جہانوں کا پالنے والا ہے۔ بڑا مہربان نہایت رحم والا۔ روز جزا کا مالک۔ ہم تیری ہی عبادت کرتے ہیں اور تجھ سے ہی مدد مانگتے ہیں۔ ہمیں سیدھے راستے کی ہدایت دے۔ ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، نہ ان کا جن پر غضب ہوا اور نہ گمراہوں کا۔ آمین۔"
  },
  {
    title: "At-Tahiyyat",
    titleUrdu: "التحیات",
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration: "At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu 'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. As-salamu 'alayna wa 'ala 'ibadillahis-salihin. Ash-hadu alla ilaha illallah wa ash-hadu anna Muhammadan 'abduhu wa rasuluh.",
    translation: "All greetings, prayers and pure words are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god except Allah, and I bear witness that Muhammad is His servant and Messenger.",
    translationUrdu: "تمام سلام، نمازیں اور پاک باتیں اللہ کے لیے ہیں۔ اے نبی! آپ پر سلام اور اللہ کی رحمت اور برکتیں۔ ہم پر اور اللہ کے نیک بندوں پر سلام۔ میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، اور گواہی دیتا ہوں کہ محمد اس کے بندے اور رسول ہیں۔"
  },
  {
    title: "Durood Ibrahim",
    titleUrdu: "درود ابراہیم",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration: "Allahumma salli 'ala Muhammad wa 'ala aali Muhammad, kama sallayta 'ala Ibrahim wa 'ala aali Ibrahim, innaka Hamidun Majid. Allahumma barik 'ala Muhammad wa 'ala aali Muhammad, kama barakta 'ala Ibrahim wa 'ala aali Ibrahim, innaka Hamidun Majid.",
    translation: "O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.",
    translationUrdu: "اے اللہ! محمد پر اور محمد کی آل پر رحمت نازل فرما جیسے تو نے ابراہیم پر اور ابراہیم کی آل پر رحمت نازل فرمائی۔ بے شک تو قابل تعریف بزرگی والا ہے۔ اے اللہ! محمد پر اور محمد کی آل پر برکت نازل فرما جیسے تو نے ابراہیم پر اور ابراہیم کی آل پر برکت نازل فرمائی۔ بے شک تو قابل تعریف بزرگی والا ہے۔"
  }
];

const NamazPage = () => {
  const { t, language } = useLanguage();

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
            <h1 className="text-xl font-bold">{t("page.namaz")}</h1>
            <p className="text-sm text-primary-foreground/70 font-arabic">{t("page.namazArabic")}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="prayers" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="prayers">{t("namaz.dailyPrayers")}</TabsTrigger>
            <TabsTrigger value="howto">{t("namaz.howToPray")}</TabsTrigger>
            <TabsTrigger value="duas">{t("namaz.essentialDuas")}</TabsTrigger>
          </TabsList>

          <TabsContent value="prayers" className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">{t("namaz.fivePrayers")}</h2>
              <p className="text-muted-foreground">الصلوات الخمس</p>
            </div>
            {prayers.map((prayer) => (
              <Card key={prayer.name} className="p-6 bg-card border-border hover:border-gold/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {language === "ur" ? prayer.nameUrdu : prayer.name}
                      </h3>
                      <p className="text-gold font-arabic">{prayer.arabic}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {language === "ur" ? prayer.timeUrdu : prayer.time}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {language === "ur" ? prayer.rakatsUrdu : prayer.rakats}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="howto" className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">{t("namaz.howToPerform")}</h2>
              <p className="text-muted-foreground">{t("namaz.stepByStep")}</p>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {prayerSteps.map((step) => (
                <AccordionItem key={step.step} value={`step-${step.step}`} className="border border-border rounded-lg px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-gold-foreground text-sm font-bold">
                        {step.step}
                      </span>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">
                          {language === "ur" ? step.titleUrdu : step.title}
                        </p>
                        <p className="text-sm text-gold font-arabic">{step.arabic}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <p className="text-muted-foreground mb-2">
                      {language === "ur" ? step.descriptionUrdu : step.description}
                    </p>
                    <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
                      {language === "ur" ? step.detailsUrdu : step.details}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="duas" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">{t("namaz.essentialDuasTitle")}</h2>
              <p className="text-muted-foreground">أدعية الصلاة الأساسية</p>
            </div>
            {essentialDuas.map((dua, index) => (
              <Card key={index} className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gold" />
                  {language === "ur" ? dua.titleUrdu : dua.title}
                </h3>
                <div className="space-y-4">
                  <p className="text-xl font-arabic text-gold leading-loose text-right">
                    {dua.arabic}
                  </p>
                  <p className="text-muted-foreground italic text-sm">
                    {dua.transliteration}
                  </p>
                  <p className="text-foreground text-sm bg-muted/50 p-3 rounded-lg">
                    <strong>{language === "ur" ? "ترجمہ:" : "Translation:"}</strong> {language === "ur" ? dua.translationUrdu : dua.translation}
                  </p>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default NamazPage;
