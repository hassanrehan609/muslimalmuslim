export interface Zikr {
  id: number;
  arabic: string;
  ref: string;
  benefitEn: string;
  benefitUr: string;
  repeat: number;
}

const common: Omit<Zikr, "id">[] = [
  {
    arabic: "أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ ۝ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    ref: "Al-Baqarah 2:255",
    benefitEn: "Whoever recites this will be protected from jinn until the next morning/evening.",
    benefitUr: "جو اسے پڑھے وہ اگلی صبح/شام تک جنات سے محفوظ رہتا ہے۔",
    repeat: 1,
  },
  {
    arabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ ۝ قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    ref: "Al-Ikhlas 112",
    benefitEn: "Reciting the three Quls three times suffices you against everything.",
    benefitUr: "تینوں قل تین مرتبہ پڑھنا ہر چیز سے کافی ہو جاتا ہے۔",
    repeat: 3,
  },
  {
    arabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    ref: "Al-Falaq 113",
    benefitEn: "Protection from every evil (Abu Dawud).",
    benefitUr: "ہر برائی سے حفاظت (ابو داؤد)۔",
    repeat: 3,
  },
  {
    arabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    ref: "An-Nas 114",
    benefitEn: "Protection from whispers of Shaytan.",
    benefitUr: "شیطان کے وسوسوں سے حفاظت۔",
    repeat: 3,
  },
  {
    arabic: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    ref: "Abu Dawud, Tirmidhi",
    benefitEn: "Nothing will harm the one who says it three times.",
    benefitUr: "جو تین مرتبہ پڑھے اسے کوئی چیز نقصان نہیں پہنچائے گی۔",
    repeat: 3,
  },
  {
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    ref: "At-Tawbah 9:129",
    benefitEn: "Allah will suffice him in whatever worries him (7 times).",
    benefitUr: "سات مرتبہ پڑھنے والے کی ہر فکر کے لیے اللہ کافی ہے۔",
    repeat: 7,
  },
  {
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    ref: "Abu Dawud",
    benefitEn: "Allah promises to please him on the Day of Judgement.",
    benefitUr: "اللہ قیامت کے دن اسے راضی کرے گا۔",
    repeat: 3,
  },
  {
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    ref: "Muslim",
    benefitEn: "Sins forgiven even if like the foam of the sea (100 times).",
    benefitUr: "سو مرتبہ پڑھنے سے گناہ معاف ہو جاتے ہیں چاہے سمندر کی جھاگ کے برابر ہوں۔",
    repeat: 100,
  },
  {
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    ref: "Bukhari, Muslim",
    benefitEn: "Reward of freeing ten slaves and protection from Shaytan (10 times).",
    benefitUr: "دس غلام آزاد کرنے کا ثواب اور شیطان سے حفاظت۔",
    repeat: 10,
  },
  {
    arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    ref: "Bukhari",
    benefitEn: "The Prophet ﷺ sought forgiveness more than 70 times a day.",
    benefitUr: "نبی ﷺ دن میں ستر سے زیادہ مرتبہ استغفار کرتے تھے۔",
    repeat: 100,
  },
];

const morningOnly: Omit<Zikr, "id">[] = [
  {
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    ref: "Muslim",
    benefitEn: "Morning remembrance taught by the Prophet ﷺ.",
    benefitUr: "نبی ﷺ کا سکھایا ہوا صبح کا ذکر۔",
    repeat: 1,
  },
  {
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    ref: "Tirmidhi",
    benefitEn: "Begin the day relying on Allah.",
    benefitUr: "دن کا آغاز اللہ پر بھروسے کے ساتھ۔",
    repeat: 1,
  },
];

const eveningOnly: Omit<Zikr, "id">[] = [
  {
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    ref: "Muslim",
    benefitEn: "Evening remembrance taught by the Prophet ﷺ.",
    benefitUr: "نبی ﷺ کا سکھایا ہوا شام کا ذکر۔",
    repeat: 1,
  },
  {
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    ref: "Muslim",
    benefitEn: "No creature will harm him that night (3 times).",
    benefitUr: "اس رات کوئی مخلوق اسے نقصان نہیں پہنچائے گی۔",
    repeat: 3,
  },
];

export const MORNING: Zikr[] = [...morningOnly, ...common].map((z, i) => ({ ...z, id: i + 1 }));
export const EVENING: Zikr[] = [...eveningOnly, ...common].map((z, i) => ({ ...z, id: i + 1 }));

/** Ayat that make up the Manzil: [surah, fromAyah, toAyah] */
export const MANZIL_REFS: [number, number, number][] = [
  [1, 1, 7], [2, 1, 5], [2, 163, 163], [2, 255, 257], [2, 284, 286],
  [3, 18, 18], [3, 26, 27], [7, 54, 56], [17, 110, 111], [23, 115, 118],
  [37, 1, 11], [55, 33, 40], [59, 21, 24], [72, 1, 4], [109, 1, 6],
  [112, 1, 4], [113, 1, 5], [114, 1, 6],
];

export const RECITERS = [
  { id: "ar.alafasy", bitrate: 128, short: "MR", name: "Mishary Rashid Alafasy", arabic: "مشاري راشد العفاسي", country: "Kuwait" },
  { id: "ar.abdurrahmaansudais", bitrate: 64, short: "AS", name: "Abdur-Rahman As-Sudais", arabic: "عبد الرحمن السديس", country: "Saudi Arabia" },
  { id: "ar.mahermuaiqly", bitrate: 128, short: "MA", name: "Maher Al-Muaiqly", arabic: "ماهر المعيقلي", country: "Saudi Arabia" },
  { id: "ar.abdulbasitmurattal", bitrate: 64, short: "AB", name: "Abdul Basit", arabic: "عبد الباسط عبد الصمد", country: "Egypt" },
  { id: "ar.husary", bitrate: 128, short: "MH", name: "Mahmoud Khalil Al-Husary", arabic: "محمود خليل الحصري", country: "Egypt" },
];

export const BENEFITS_EN = [
  "Manzil is a collection of ayat and short surahs from the Quran, recited as a means of protection and healing (ruqyah).",
  "Scholars recommend it for protection from black magic, jinn, sihr, the evil eye and other harmful influences, by the permission of Allah.",
  "It is ideally recited once in the morning and once in the evening, and may be read once or three times in one sitting.",
  "It contains Ayat al-Kursi, the last verses of Surah Al-Baqarah and the three Quls — each with authentic narrations about protection.",
  "The Prophet ﷺ said: whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him (Bukhari).",
  "Consistency matters more than quantity — the most beloved deeds to Allah are those done regularly, even if small (Bukhari).",
];

export const BENEFITS_UR = [
  "منزل قرآن کریم کی آیات اور چھوٹی سورتوں کا مجموعہ ہے جو حفاظت اور شفا (رقیہ) کے لیے پڑھا جاتا ہے۔",
  "علماء اسے جادو، جنات، سحر، نظرِ بد اور دیگر نقصان دہ اثرات سے حفاظت کے لیے تجویز کرتے ہیں، اللہ کے حکم سے۔",
  "بہتر ہے کہ اسے صبح ایک بار اور شام ایک بار پڑھا جائے، ایک نشست میں ایک یا تین مرتبہ۔",
  "اس میں آیت الکرسی، سورۃ البقرہ کی آخری آیات اور تینوں قل شامل ہیں — جن کی حفاظت کے بارے میں صحیح روایات ہیں۔",
  "نبی ﷺ نے فرمایا: جو رات کو سورۃ البقرہ کی آخری دو آیات پڑھے، وہ اس کے لیے کافی ہوں گی (بخاری)۔",
  "مقدار سے زیادہ پابندی اہم ہے — اللہ کو سب سے محبوب عمل وہ ہے جو ہمیشہ کیا جائے چاہے تھوڑا ہو (بخاری)۔",
];
