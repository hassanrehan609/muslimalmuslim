import { Moon, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AIChatSearch from "./AIChatSearch";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen hero-gradient islamic-pattern overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-float">
          <Star className="w-6 h-6 text-gold/40 fill-gold/40" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: "1s" }}>
          <Star className="w-4 h-4 text-gold/30 fill-gold/30" />
        </div>
        <div className="absolute bottom-40 left-1/4 animate-float" style={{ animationDelay: "2s" }}>
          <Star className="w-5 h-5 text-gold/50 fill-gold/50" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-pulse-slow">
          <Sparkles className="w-8 h-8 text-gold/30" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Main crescent moon */}
          <div className="relative mb-8 animate-scale-in">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold to-gold-light shadow-gold animate-glow flex items-center justify-center">
              <Moon className="w-20 h-20 text-foreground fill-foreground/10" />
            </div>
            <Star className="w-8 h-8 text-gold absolute -top-2 right-0 fill-gold animate-pulse-slow" />
          </div>

          {/* Arabic bismillah */}
          <p className="text-2xl md:text-3xl font-arabic text-primary-foreground/90 mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {t("hero.title")}
          </h1>
          
          <p className="text-xl md:text-2xl font-arabic text-gold mb-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            مسلم المسلم
          </p>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl animate-fade-in" style={{ animationDelay: "0.6s" }}>
            {t("hero.subtitle")}
          </p>

          {/* AI Chat Search */}
          <AIChatSearch />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 animate-fade-in" style={{ animationDelay: "0.9s" }}>
            <Link to="/quran">
              <Button variant="gold" size="xl">
                {t("hero.readQuran")}
              </Button>
            </Link>
            <a href="#features">
              <Button variant="glass" size="xl" className="text-primary-foreground border-primary-foreground/30">
                {t("hero.exploreFeatures")}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(40, 30%, 97%)"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
