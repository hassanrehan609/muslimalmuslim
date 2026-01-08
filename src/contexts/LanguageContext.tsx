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
    "nav.profile": "Profile",
    
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
    "auth.forgotPassword": "Forgot Password?",
    "auth.resetPassword": "Reset Password",
    "auth.resetSubtitle": "Enter your phone number to reset password",
    "auth.sendResetLink": "Send Reset Link",
    "auth.sending": "Sending...",
    "auth.backToLogin": "Back to Login",
    
    // Profile
    "profile.title": "My Profile",
    "profile.details": "Account Details",
    "profile.edit": "Edit",
    "profile.save": "Save",
    "profile.noName": "No name set",
    "profile.accountNumber": "Account Number",
    "profile.cannotChangePhone": "Phone number cannot be changed",
    "profile.denomination": "Denomination",
    "profile.changePassword": "Change Password",
    "profile.newPassword": "New Password",
    "profile.confirmPassword": "Confirm Password",
    "profile.updatePassword": "Update Password",
    "profile.logout": "Logout",
    
    // Pages
    "page.duas": "Daily Duas",
    "page.duasArabic": "الأدعية اليومية",
    "page.names": "99 Names of Allah",
    "page.namesArabic": "أسماء الله الحسنى",
    "page.tasbeeh": "Tasbeeh Counter",
    "page.tasbeehArabic": "المسبحة",
    "page.quran": "Holy Quran",
    "page.quranArabic": "القرآن الكريم",
    "page.calendar": "Islamic Calendar",
    "page.calendarArabic": "التقويم الهجري",
    "page.favorites": "Favorites",
    "page.favoritesArabic": "المفضلة",
    "page.kalmas": "Six Kalmas",
    "page.kalmasArabic": "الکلمات الستة",
    "page.namaz": "Namaz / Salah Guide",
    "page.namazArabic": "دليل الصلاة",
    
    // Duas page
    "duas.morning": "Morning",
    "duas.evening": "Evening",
    "duas.sleeping": "Before Sleeping",
    "duas.food": "Food & Eating",
    "duas.daily": "Daily Life",
    "duas.protection": "Protection",
    "duas.transliteration": "Transliteration",
    "duas.translation": "Translation",
    
    // Tasbeeh
    "tasbeeh.selectDhikr": "Select Dhikr",
    "tasbeeh.tapToCount": "Tap to count",
    "tasbeeh.complete": "Complete!",
    "tasbeeh.reset": "Reset Counter",
    "tasbeeh.setTarget": "Set Target",
    "tasbeeh.customTarget": "Custom target...",
    "tasbeeh.set": "Set",
    
    // Names
    "names.search": "Search by name or meaning...",
    "names.noResults": "No names found matching",
    
    // Quran
    "quran.search": "Search surah...",
    "quran.verses": "verses",
    "quran.playAll": "Play All",
    "quran.stop": "Stop",
    "quran.bismillah": "In the name of Allah, the Most Gracious, the Most Merciful",
    
    // Calendar
    "calendar.events": "Events",
    "calendar.months": "Months",
    "calendar.converter": "Converter",
    "calendar.upcoming": "Upcoming Islamic Events",
    "calendar.allEvents": "All Islamic Events",
    "calendar.islamicMonths": "Islamic Months",
    "calendar.current": "Current",
    "calendar.dateConverter": "Date Converter",
    "calendar.gregorianToHijri": "Gregorian → Hijri",
    "calendar.hijriToGregorian": "Hijri → Gregorian",
    "calendar.convert": "Convert",
    "calendar.result": "Result",
    
    // Favorites
    "favorites.saved": "saved",
    "favorites.all": "All",
    "favorites.duas": "Duas",
    "favorites.names": "Names",
    "favorites.verses": "Verses",
    "favorites.noFavorites": "No favorites yet",
    "favorites.startExploring": "Start exploring and save your favorite duas, names of Allah, and Quran verses.",
    "favorites.browseDuas": "Browse Duas",
    "favorites.99Names": "99 Names",
    "favorites.holyQuran": "Holy Quran",
    "favorites.noSaved": "No {type} saved yet",
    "favorites.tapHeart": "Tap the heart icon on any {type} to save it here for quick access.",
    
    // Kalmas
    "kalmas.translation": "Translation",
    "kalmas.meaning": "Meaning",
    
    // Namaz
    "namaz.dailyPrayers": "Daily Prayers",
    "namaz.howToPray": "How to Pray",
    "namaz.essentialDuas": "Essential Duas",
    "namaz.fivePrayers": "Five Daily Prayers",
    "namaz.howToPerform": "How to Perform Salah",
    "namaz.stepByStep": "Step-by-step guide to prayer",
    "namaz.essentialDuasTitle": "Essential Duas for Prayer",
    
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
    "common.of": "of",
    "common.addedToFavorites": "Added to favorites",
    "common.removedFromFavorites": "Removed from favorites",
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
    "nav.profile": "پروفائل",
    
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
    "auth.forgotPassword": "پاس ورڈ بھول گئے؟",
    "auth.resetPassword": "پاس ورڈ ری سیٹ کریں",
    "auth.resetSubtitle": "پاس ورڈ ری سیٹ کرنے کے لیے اپنا فون نمبر درج کریں",
    "auth.sendResetLink": "ری سیٹ لنک بھیجیں",
    "auth.sending": "بھیجا جا رہا ہے...",
    "auth.backToLogin": "لاگ ان پر واپس جائیں",
    
    // Profile
    "profile.title": "میری پروفائل",
    "profile.details": "اکاؤنٹ کی تفصیلات",
    "profile.edit": "ترمیم",
    "profile.save": "محفوظ کریں",
    "profile.noName": "نام درج نہیں",
    "profile.accountNumber": "اکاؤنٹ نمبر",
    "profile.cannotChangePhone": "فون نمبر تبدیل نہیں ہو سکتا",
    "profile.denomination": "مسلک",
    "profile.changePassword": "پاس ورڈ تبدیل کریں",
    "profile.newPassword": "نیا پاس ورڈ",
    "profile.confirmPassword": "پاس ورڈ کی تصدیق",
    "profile.updatePassword": "پاس ورڈ اپ ڈیٹ کریں",
    "profile.logout": "لاگ آؤٹ",
    
    // Pages
    "page.duas": "روزانہ کی دعائیں",
    "page.duasArabic": "الأدعية اليومية",
    "page.names": "اللہ کے ۹۹ نام",
    "page.namesArabic": "أسماء الله الحسنى",
    "page.tasbeeh": "تسبیح کاؤنٹر",
    "page.tasbeehArabic": "المسبحة",
    "page.quran": "قرآن مجید",
    "page.quranArabic": "القرآن الكريم",
    "page.calendar": "اسلامی کیلنڈر",
    "page.calendarArabic": "التقويم الهجري",
    "page.favorites": "پسندیدہ",
    "page.favoritesArabic": "المفضلة",
    "page.kalmas": "چھ کلمے",
    "page.kalmasArabic": "الکلمات الستة",
    "page.namaz": "نماز / صلاۃ گائیڈ",
    "page.namazArabic": "دليل الصلاة",
    
    // Duas page
    "duas.morning": "صبح",
    "duas.evening": "شام",
    "duas.sleeping": "سونے سے پہلے",
    "duas.food": "کھانا پینا",
    "duas.daily": "روزمرہ زندگی",
    "duas.protection": "حفاظت",
    "duas.transliteration": "تلفظ",
    "duas.translation": "ترجمہ",
    
    // Tasbeeh
    "tasbeeh.selectDhikr": "ذکر منتخب کریں",
    "tasbeeh.tapToCount": "گننے کے لیے ٹچ کریں",
    "tasbeeh.complete": "مکمل!",
    "tasbeeh.reset": "کاؤنٹر ری سیٹ کریں",
    "tasbeeh.setTarget": "ہدف مقرر کریں",
    "tasbeeh.customTarget": "اپنی مرضی کا ہدف...",
    "tasbeeh.set": "سیٹ",
    
    // Names
    "names.search": "نام یا معنی سے تلاش کریں...",
    "names.noResults": "کوئی نام نہیں ملا",
    
    // Quran
    "quran.search": "سورہ تلاش کریں...",
    "quran.verses": "آیات",
    "quran.playAll": "سب چلائیں",
    "quran.stop": "روکیں",
    "quran.bismillah": "اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے",
    
    // Calendar
    "calendar.events": "واقعات",
    "calendar.months": "مہینے",
    "calendar.converter": "تبدیل کریں",
    "calendar.upcoming": "آنے والے اسلامی واقعات",
    "calendar.allEvents": "تمام اسلامی واقعات",
    "calendar.islamicMonths": "اسلامی مہینے",
    "calendar.current": "موجودہ",
    "calendar.dateConverter": "تاریخ تبدیل کریں",
    "calendar.gregorianToHijri": "عیسوی ← ہجری",
    "calendar.hijriToGregorian": "ہجری ← عیسوی",
    "calendar.convert": "تبدیل کریں",
    "calendar.result": "نتیجہ",
    
    // Favorites
    "favorites.saved": "محفوظ",
    "favorites.all": "سب",
    "favorites.duas": "دعائیں",
    "favorites.names": "نام",
    "favorites.verses": "آیات",
    "favorites.noFavorites": "ابھی تک کوئی پسندیدہ نہیں",
    "favorites.startExploring": "تلاش شروع کریں اور اپنی پسندیدہ دعائیں، اللہ کے نام اور قرآنی آیات محفوظ کریں۔",
    "favorites.browseDuas": "دعائیں دیکھیں",
    "favorites.99Names": "۹۹ نام",
    "favorites.holyQuran": "قرآن مجید",
    "favorites.noSaved": "ابھی تک کوئی {type} محفوظ نہیں",
    "favorites.tapHeart": "کسی بھی {type} کو یہاں محفوظ کرنے کے لیے دل کے آئیکن پر ٹچ کریں۔",
    
    // Kalmas
    "kalmas.translation": "ترجمہ",
    "kalmas.meaning": "مفہوم",
    
    // Namaz
    "namaz.dailyPrayers": "روزانہ نمازیں",
    "namaz.howToPray": "نماز کا طریقہ",
    "namaz.essentialDuas": "ضروری دعائیں",
    "namaz.fivePrayers": "پانچ وقت کی نماز",
    "namaz.howToPerform": "نماز کیسے ادا کریں",
    "namaz.stepByStep": "قدم بہ قدم رہنمائی",
    "namaz.essentialDuasTitle": "نماز کی ضروری دعائیں",
    
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
    "common.of": "میں سے",
    "common.addedToFavorites": "پسندیدہ میں شامل ہو گیا",
    "common.removedFromFavorites": "پسندیدہ سے ہٹا دیا گیا",
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
