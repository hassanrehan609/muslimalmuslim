import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, Target, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const presetTargets = [33, 99, 100, 500, 1000];

const dhikrPhrases = [
  { arabic: "سُبْحَانَ اللَّهِ", transliteration: "SubhanAllah", meaning: "Glory be to Allah", meaningUrdu: "اللہ پاک ہے" },
  { arabic: "الْحَمْدُ لِلَّهِ", transliteration: "Alhamdulillah", meaning: "All praise is due to Allah", meaningUrdu: "تمام تعریفیں اللہ کے لیے ہیں" },
  { arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar", meaning: "Allah is the Greatest", meaningUrdu: "اللہ سب سے بڑا ہے" },
  { arabic: "لَا إِلَهَ إِلَّا اللَّهُ", transliteration: "La ilaha illallah", meaning: "There is no god but Allah", meaningUrdu: "اللہ کے سوا کوئی معبود نہیں" },
  { arabic: "أَسْتَغْفِرُ اللَّهَ", transliteration: "Astaghfirullah", meaning: "I seek forgiveness from Allah", meaningUrdu: "میں اللہ سے معافی مانگتا ہوں" },
];

const TasbeehPage = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [customTarget, setCustomTarget] = useState("");
  const [selectedDhikr, setSelectedDhikr] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false);
  const { t, language } = useLanguage();

  const handleCount = useCallback(() => {
    if (count < target) {
      const newCount = count + 1;
      setCount(newCount);
      if (newCount === target) {
        setShowCompleted(true);
        setTimeout(() => setShowCompleted(false), 2000);
      }
    }
  }, [count, target]);

  const handleReset = () => {
    setCount(0);
    setShowCompleted(false);
  };

  const handleTargetChange = (newTarget: number) => {
    setTarget(newTarget);
    setCount(0);
    setShowCompleted(false);
  };

  const handleCustomTargetSubmit = () => {
    const value = parseInt(customTarget);
    if (value > 0) {
      handleTargetChange(value);
      setCustomTarget("");
    }
  };

  const progress = (count / target) * 100;
  const currentDhikr = dhikrPhrases[selectedDhikr];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("page.tasbeeh")}</h1>
            <p className="text-xs text-muted-foreground font-arabic">{t("page.tasbeehArabic")}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Dhikr Selection */}
        <div className="mb-8">
          <p className="text-sm font-medium text-muted-foreground mb-3 text-center">{t("tasbeeh.selectDhikr")}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {dhikrPhrases.map((dhikr, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedDhikr(index);
                  handleReset();
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDhikr === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {dhikr.transliteration}
              </button>
            ))}
          </div>
        </div>

        {/* Current Dhikr Display */}
        <Card className="p-8 bg-card border-border/50 mb-8 text-center">
          <p className="text-4xl md:text-5xl font-arabic text-foreground leading-relaxed mb-4" dir="rtl">
            {currentDhikr.arabic}
          </p>
          <p className="text-xl font-semibold text-gold mb-2">{currentDhikr.transliteration}</p>
          <p className="text-muted-foreground">{language === "ur" ? currentDhikr.meaningUrdu : currentDhikr.meaning}</p>
        </Card>

        {/* Counter Display */}
        <div className="relative mb-8">
          {/* Progress Ring */}
          <div className="relative w-64 h-64 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                strokeLinecap="round"
                className="text-primary transition-all duration-300"
              />
            </svg>

            {/* Tap Button */}
            <button
              onClick={handleCount}
              disabled={count >= target}
              className={`absolute inset-8 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center transition-all active:scale-95 hover:shadow-elevated ${
                showCompleted ? "animate-pulse bg-gold" : ""
              } ${count >= target ? "opacity-80" : ""}`}
            >
              {showCompleted ? (
                <>
                  <Check className="w-12 h-12 mb-2" />
                  <span className="text-lg font-semibold">{t("tasbeeh.complete")}</span>
                </>
              ) : (
                <>
                  <span className="text-5xl font-bold">{count}</span>
                  <span className="text-sm opacity-80">{t("common.of")} {target}</span>
                  <span className="text-xs mt-2 opacity-60">{t("tasbeeh.tapToCount")}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {t("tasbeeh.reset")}
          </Button>
        </div>

        {/* Target Selection */}
        <Card className="p-6 bg-card border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-gold" />
            <h3 className="font-semibold text-foreground">{t("tasbeeh.setTarget")}</h3>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {presetTargets.map((preset) => (
              <button
                key={preset}
                onClick={() => handleTargetChange(preset)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  target === preset
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t("tasbeeh.customTarget")}
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              min="1"
            />
            <Button onClick={handleCustomTargetSubmit} disabled={!customTarget}>
              {t("tasbeeh.set")}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default TasbeehPage;
