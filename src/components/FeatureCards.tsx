import { BookOpen, Heart, Fingerprint, Star, Calendar, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "Holy Quran",
    arabic: "القرآن الكريم",
    description: "Read, listen, and explore the complete Quran with translations and tafsir.",
  },
  {
    icon: Heart,
    title: "Daily Duas",
    arabic: "الأدعية اليومية",
    description: "Collection of essential duas for every moment of your day.",
  },
  {
    icon: Fingerprint,
    title: "Tasbeeh Counter",
    arabic: "المسبحة",
    description: "Digital tasbeeh to track your dhikr with customizable counters.",
  },
  {
    icon: Star,
    title: "99 Names of Allah",
    arabic: "أسماء الله الحسنى",
    description: "Learn and reflect upon the beautiful names of Allah.",
  },
  {
    icon: Calendar,
    title: "Islamic Calendar",
    arabic: "التقويم الهجري",
    description: "Hijri calendar with important Islamic dates and events.",
  },
  {
    icon: Volume2,
    title: "Adhan Alerts",
    arabic: "تنبيهات الأذان",
    description: "Never miss a prayer with beautiful adhan notifications.",
  },
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
            return (
              <Card
                key={feature.title}
                className="group p-6 bg-card hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 cursor-pointer border-border/50 hover:border-gold/50"
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
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
