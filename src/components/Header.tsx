import { Moon, Star, Heart, Bell, Menu, X, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language } = useLanguage();
  const { signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative">
            <Moon className="w-8 h-8 text-primary fill-primary" />
            <Star className="w-3 h-3 text-gold absolute -top-1 -right-1 fill-gold" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Muslim al Muslim</h1>
            <p className="text-xs text-muted-foreground font-arabic">مسلم المسلم</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/quran" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("nav.quran")}
            </Link>
            <Link to="/duas" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("nav.duas")}
            </Link>
            <Link to="/calendar" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("nav.calendar")}
            </Link>
            <Link to="/adhan-settings" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Bell className="w-4 h-4" />
              {t("nav.adhan")}
            </Link>
            <Link to="/favorites" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {t("nav.favorites")}
            </Link>
            <Link to="/profile" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <User className="w-4 h-4" />
              {t("nav.profile")}
            </Link>
          </nav>
          <LanguageToggle />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="h-9 w-9 rounded-lg text-destructive hover:text-destructive"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/quran" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.quran")}
            </Link>
            <Link 
              to="/duas" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.duas")}
            </Link>
            <Link 
              to="/calendar" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.calendar")}
            </Link>
            <Link 
              to="/names-of-allah" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.names")}
            </Link>
            <Link 
              to="/tasbeeh" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.tasbeeh")}
            </Link>
            <Link 
              to="/adhan-settings" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Bell className="w-4 h-4" />
              {t("nav.adhanSettings")}
            </Link>
            <Link 
              to="/favorites" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="w-4 h-4" />
              {t("nav.favorites")}
            </Link>
            <button
              onClick={() => { signOut(); setMobileMenuOpen(false); }}
              className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors py-2 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {language === "ur" ? "لاگ آؤٹ" : "Logout"}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
