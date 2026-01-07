import { Moon, Star, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <Moon className="w-8 h-8 fill-gold text-gold" />
              <Star className="w-3 h-3 text-gold absolute -top-1 -right-1 fill-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Muslim al Muslim</h3>
              <p className="text-sm text-gold">Hafiz Imran Badar</p>
              <p className="text-xs text-primary-foreground/60">Made by Hassan Rehan Badar</p>
            </div>
          </div>

          {/* Dua */}
          <p className="font-arabic text-lg text-primary-foreground/80 mb-4 max-w-md">
            اللَّهُمَّ اجْعَلْنَا مِنَ الْمُسْلِمِينَ الصَّادِقِينَ
          </p>
          <p className="text-sm text-primary-foreground/60 mb-8">
            "O Allah, make us among the sincere Muslims"
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
            <a href="#prayers" className="hover:text-gold transition-colors">{t("footer.prayerTimes")}</a>
            <a href="#qibla" className="hover:text-gold transition-colors">{t("footer.qibla")}</a>
            <a href="#features" className="hover:text-gold transition-colors">{t("footer.features")}</a>
            <a href="#" className="hover:text-gold transition-colors">{t("footer.about")}</a>
            <a href="#" className="hover:text-gold transition-colors">{t("footer.contact")}</a>
          </div>

          {/* Divider */}
          <div className="w-full max-w-md h-px bg-primary-foreground/20 mb-6" />

          {/* Copyright */}
          <p className="text-sm text-primary-foreground/60 flex items-center gap-1">
            {t("footer.madeWith")} <Heart className="w-4 h-4 text-gold fill-gold" /> {t("footer.forUmmah")}
          </p>
          <p className="text-xs text-primary-foreground/40 mt-2">
            © 2026 Muslim al Muslim. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
