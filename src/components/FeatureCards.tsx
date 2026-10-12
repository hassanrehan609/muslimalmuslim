import { BookOpen, Heart, Fingerprint, Star, Calendar, Bookmark, Bot, BookText, Moon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const FeatureCards = () => {
  const { t } = useLanguage();

  const features = [
    { icon: BookOpen, titleKey: "feature.quran", arabic: "القرآن الكريم", descKey: "feature.quran.desc", link: "/quran" },
    { icon: Shield, titleKey: "feature.manzil", arabic: "المنزل", descKey: "feature.manzil.desc", link: "/manzil" },
    { icon: Heart, titleKey: "feature.duas", arabic: "الأدعية اليومية", descKey: "feature.duas.desc", link: "/duas" },
    { icon: Fingerprint, titleKey: "feature.tasbeeh", arabic: "المسبحة", descKey: "feature.tasbeeh.desc", link: "/tasbeeh" },
    { icon: Star, titleKey: "feature.names", arabic: "أسماء الله الحسنى", descKey: "feature.names.desc", link: "/names-of-allah" },
    { icon: Calendar, titleKey: "feature.calendar", arabic: "التقويم الهجري", descKey: "feature.calendar.desc", link: "/calendar" },
    { icon: Bookmark, titleKey: "feature.favorites", arabic: "المفضلة", descKey: "feature.favorites.desc", link: "/favorites" },
    { icon: Bot, titleKey: "feature.chat", arabic: "المحادثة الإسلامية", descKey: "feature.chat.desc", link: "/chatbot" },
    { icon: BookText, titleKey: "feature.kalmas", arabic: "الکلمات الستة", descKey: "feature.kalmas.desc", link: "/kalmas" },
    { icon: Moon, titleKey: "feature.namaz", arabic: "دليل الصلاة", descKey: "feature.namaz.desc", link: "/namaz" },
  ];

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold font-arabic text-xl mb-2">المميزات</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("features.title")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            const cardContent = (
              <Card
                className="group glass-strong p-6 rounded-2xl hover:bg-primary/90 hover:text-primary-foreground transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 cursor-pointer hover:border-gold/50 h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary-foreground/10 flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-7 h-7 text-primary group-hover:text-gold transition-colors" />
                </div>
                <p className="text-gold font-arabic text-lg mb-1 group-hover:text-gold-light transition-colors">
                  {feature.arabic}
                </p>
                <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary-foreground transition-colors">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">
                  {t(feature.descKey)}
                </p>
              </Card>
            );
            
            return (
              <Link key={feature.titleKey} to={feature.link}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
