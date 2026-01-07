import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ur";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "nav.quran": "Quran",
    "nav.duas": "Duas",
    "nav.calendar": "Calendar",
    "nav.adhan": "Adhan",
    "nav.favorites": "Favorites",
    "nav.names": "99 Names",
    "nav.tasbeeh": "Tasbeeh",
    "nav.adhanSettings": "Adhan Settings",
    
    // Hero
    "hero.title": "Muslim al Muslim",
    "hero.subtitle": "Your complete Islamic companion for prayer times, Quran, Qibla direction, and daily spiritual guidance.",
    "hero.readQuran": "Read Quran",
    "hero.exploreFeatures": "Explore Features",
    "hero.askQuestion": "Ask any Islamic question...",
    
    // Features
    "features.title": "Features",
    "features.subtitle": "Everything you need for your spiritual journey, beautifully designed and easy to use.",
    "feature.quran": "Holy Quran",
    "feature.quran.desc": "Read, listen, and explore the complete Quran with translations.",
    "feature.duas": "Daily Duas",
    "feature.duas.desc": "Collection of essential duas for every moment.",
    "feature.tasbeeh": "Tasbeeh Counter",
    "feature.tasbeeh.desc": "Digital tasbeeh to track your dhikr.",
    "feature.names": "99 Names of Allah",
    "feature.names.desc": "Learn the beautiful names of Allah.",
    "feature.calendar": "Islamic Calendar",
    "feature.calendar.desc": "Hijri calendar with important dates.",
    "feature.favorites": "My Favorites",
    "feature.favorites.desc": "Quick access to saved items.",
    "feature.chat": "AI Islamic Chat",
    "feature.chat.desc": "Ask questions about Islam, Quran & Hadith.",
    "feature.kalmas": "Six Kalmas",
    "feature.kalmas.desc": "Learn and recite the six kalmas.",
    "feature.namaz": "Namaz Guide",
    "feature.namaz.desc": "Complete guide to perform Salah.",
    
    // Prayer Times
    "prayer.times": "Prayer Times",
    "prayer.fajr": "Fajr",
    "prayer.sunrise": "Sunrise",
    "prayer.dhuhr": "Dhuhr",
    "prayer.asr": "Asr",
    "prayer.maghrib": "Maghrib",
    "prayer.isha": "Isha",
    "prayer.next": "Next Prayer",
    "prayer.location": "Location",
    
    // Qibla
    "qibla.title": "Qibla Compass",
    "qibla.direction": "Qibla Direction",
    "qibla.degrees": "degrees",
    
    // Auth
    "auth.welcomeBack": "Welcome Back",
    "auth.loginSubtitle": "Enter your account number (phone) to login",
    "auth.createAccount": "Create Account",
    "auth.signupSubtitle": "Your phone number will be your account number",
    "auth.accountNumber": "Account Number (Phone)",
    "auth.password": "Password",
    "auth.fullName": "Full Name",
    "auth.phoneNumber": "Phone Number (Account Number)",
    "auth.login": "Login",
    "auth.loggingIn": "Logging in...",
    "auth.signup": "Sign up",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.next": "Next",
    "auth.back": "Back",
    "auth.selectDenomination": "Select Your Denomination",
    "auth.denominationSubtitle": "Help us personalize your experience",
    "auth.createAccountBtn": "Create Account",
    "auth.creating": "Creating...",
    
    // Footer
    "footer.prayerTimes": "Prayer Times",
    "footer.qibla": "Qibla",
    "footer.features": "Features",
    "footer.about": "About",
    "footer.contact": "Contact",
    "footer.madeWith": "Made with",
    "footer.forUmmah": "for the Ummah",
    
    // Common
    "common.back": "Back",
    "common.search": "Search",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.language": "Language",
    "common.english": "English",
    "common.urdu": "اردو",
  },
  ur: {
    // Header
    "nav.quran": "قرآن",
    "nav.duas": "دعائیں",
    "nav.calendar": "کیلنڈر",
    "nav.adhan": "اذان",
    "nav.favorites": "پسندیدہ",
    "nav.names": "اللہ کے ۹۹ نام",
    "nav.tasbeeh": "تسبیح",
    "nav.adhanSettings": "اذان کی ترتیبات",
    
    // Hero
    "hero.title": "Muslim al Muslim",
    "hero.subtitle": "نماز کے اوقات، قرآن، قبلہ کی سمت اور روزانہ روحانی رہنمائی کے لیے آپ کا مکمل اسلامی ساتھی۔",
    "hero.readQuran": "قرآن پڑھیں",
    "hero.exploreFeatures": "خصوصیات دیکھیں",
    "hero.askQuestion": "کوئی بھی اسلامی سوال پوچھیں...",
    
    // Features
    "features.title": "خصوصیات",
    "features.subtitle": "آپ کے روحانی سفر کے لیے ہر چیز، خوبصورتی سے ڈیزائن کی گئی اور استعمال میں آسان۔",
    "feature.quran": "قرآن مجید",
    "feature.quran.desc": "ترجمے کے ساتھ مکمل قرآن پڑھیں، سنیں اور دریافت کریں۔",
    "feature.duas": "روزانہ کی دعائیں",
    "feature.duas.desc": "ہر لمحے کے لیے ضروری دعاؤں کا مجموعہ۔",
    "feature.tasbeeh": "تسبیح کاؤنٹر",
    "feature.tasbeeh.desc": "اپنے ذکر کو ٹریک کرنے کے لیے ڈیجیٹل تسبیح۔",
    "feature.names": "اللہ کے ۹۹ نام",
    "feature.names.desc": "اللہ کے خوبصورت ناموں کو سیکھیں۔",
    "feature.calendar": "اسلامی کیلنڈر",
    "feature.calendar.desc": "اہم تاریخوں کے ساتھ ہجری کیلنڈر۔",
    "feature.favorites": "میرے پسندیدہ",
    "feature.favorites.desc": "محفوظ شدہ آئٹمز تک فوری رسائی۔",
    "feature.chat": "اے آئی اسلامی چیٹ",
    "feature.chat.desc": "اسلام، قرآن اور حدیث کے بارے میں سوالات پوچھیں۔",
    "feature.kalmas": "چھ کلمے",
    "feature.kalmas.desc": "چھ کلمے سیکھیں اور پڑھیں۔",
    "feature.namaz": "نماز گائیڈ",
    "feature.namaz.desc": "نماز ادا کرنے کی مکمل رہنمائی۔",
    
    // Prayer Times
    "prayer.times": "نماز کے اوقات",
    "prayer.fajr": "فجر",
    "prayer.sunrise": "طلوع آفتاب",
    "prayer.dhuhr": "ظہر",
    "prayer.asr": "عصر",
    "prayer.maghrib": "مغرب",
    "prayer.isha": "عشاء",
    "prayer.next": "اگلی نماز",
    "prayer.location": "مقام",
    
    // Qibla
    "qibla.title": "قبلہ کمپاس",
    "qibla.direction": "قبلہ کی سمت",
    "qibla.degrees": "ڈگری",
    
    // Auth
    "auth.welcomeBack": "واپسی پر خوش آمدید",
    "auth.loginSubtitle": "لاگ ان کرنے کے لیے اپنا اکاؤنٹ نمبر (فون) درج کریں",
    "auth.createAccount": "اکاؤنٹ بنائیں",
    "auth.signupSubtitle": "آپ کا فون نمبر آپ کا اکاؤنٹ نمبر ہوگا",
    "auth.accountNumber": "اکاؤنٹ نمبر (فون)",
    "auth.password": "پاس ورڈ",
    "auth.fullName": "پورا نام",
    "auth.phoneNumber": "فون نمبر (اکاؤنٹ نمبر)",
    "auth.login": "لاگ ان",
    "auth.loggingIn": "لاگ ان ہو رہا ہے...",
    "auth.signup": "سائن اپ",
    "auth.noAccount": "کیا آپ کا اکاؤنٹ نہیں ہے؟",
    "auth.hasAccount": "پہلے سے اکاؤنٹ ہے؟",
    "auth.next": "اگلا",
    "auth.back": "واپس",
    "auth.selectDenomination": "اپنا مسلک منتخب کریں",
    "auth.denominationSubtitle": "آپ کے تجربے کو بہتر بنانے میں مدد کریں",
    "auth.createAccountBtn": "اکاؤنٹ بنائیں",
    "auth.creating": "بنایا جا رہا ہے...",
    
    // Footer
    "footer.prayerTimes": "نماز کے اوقات",
    "footer.qibla": "قبلہ",
    "footer.features": "خصوصیات",
    "footer.about": "ہمارے بارے میں",
    "footer.contact": "رابطہ کریں",
    "footer.madeWith": "محبت سے بنایا گیا",
    "footer.forUmmah": "امت کے لیے",
    
    // Common
    "common.back": "واپس",
    "common.search": "تلاش",
    "common.loading": "لوڈ ہو رہا ہے...",
    "common.error": "خرابی",
    "common.success": "کامیابی",
    "common.language": "زبان",
    "common.english": "English",
    "common.urdu": "اردو",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app-language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("app-language", language);
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = language === "ur" ? "ur" : "en";
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
