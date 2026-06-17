import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PrayerTimes from "@/components/PrayerTimes";
import QiblaCompass from "@/components/QiblaCompass";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main>
        <HeroSection />
        <PrayerTimes />
        <QiblaCompass />
        <FeatureCards />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
