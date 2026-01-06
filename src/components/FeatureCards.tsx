import { BookOpen, Heart, Fingerprint, Star, Calendar, Bookmark, Bot, BookText, Moon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const features = [
  { icon: BookOpen, title: "Holy Quran", arabic: "القرآن الكريم", description: "Read, listen, and explore the complete Quran with translations.", link: "/quran" },
  { icon: Heart, title: "Daily Duas", arabic: "الأدعية اليومية", description: "Collection of essential duas for every moment.", link: "/duas" },
  { icon: Fingerprint, title: "Tasbeeh Counter", arabic: "المسبحة", description: "Digital tasbeeh to track your dhikr.", link: "/tasbeeh" },
  { icon: Star, title: "99 Names of Allah", arabic: "أسماء الله الحسنى", description: "Learn the beautiful names of Allah.", link: "/names-of-allah" },
  { icon: Calendar, title: "Islamic Calendar", arabic: "التقويم الهجري", description: "Hijri calendar with important dates.", link: "/calendar" },
  { icon: Bookmark, title: "My Favorites", arabic: "المفضلة", description: "Quick access to saved items.", link: "/favorites" },
  { icon: Bot, title: "AI Islamic Chat", arabic: "المحادثة الإسلامية", description: "Ask questions about Islam, Quran & Hadith.", link: "/chatbot" },
  { icon: BookText, title: "Six Kalmas", arabic: "الکلمات الستة", description: "Learn and recite the six kalmas.", link: "/kalmas" },
  { icon: Moon, title: "Namaz Guide", arabic: "دليل الصلاة", description: "Complete guide to perform Salah.", link: "/namaz" },
];

const FeatureCards = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold font-arabic text-xl mb-2">المميزات</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Features</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need for your spiritual journey, beautifully designed and easy to use.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            const cardContent = (
              <Card
                className="group p-6 bg-card hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 cursor-pointer border-border/50 hover:border-gold/50 h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary-foreground/10 flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-7 h-7 text-primary group-hover:text-gold transition-colors" />
                </div>
                <p className="text-gold font-arabic text-lg mb-1 group-hover:text-gold-light transition-colors">
                  {feature.arabic}
                </p>
                <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary-foreground transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">
                  {feature.description}
                </p>
              </Card>
            );
            
            return (
              <Link key={feature.title} to={feature.link}>
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
