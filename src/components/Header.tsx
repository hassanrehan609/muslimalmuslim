import { Moon, Star, Heart, Bell, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link to="/quran" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Quran</Link>
            <Link to="/duas" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Duas</Link>
            <Link to="/calendar" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Calendar</Link>
            <Link to="/adhan-settings" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Bell className="w-4 h-4" />
              Adhan
            </Link>
            <Link to="/favorites" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Favorites
            </Link>
          </nav>
          <ThemeToggle />
          
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
              Quran
            </Link>
            <Link 
              to="/duas" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Duas
            </Link>
            <Link 
              to="/calendar" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Calendar
            </Link>
            <Link 
              to="/names-of-allah" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              99 Names
            </Link>
            <Link 
              to="/tasbeeh" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tasbeeh
            </Link>
            <Link 
              to="/adhan-settings" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Bell className="w-4 h-4" />
              Adhan Settings
            </Link>
            <Link 
              to="/favorites" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="w-4 h-4" />
              Favorites
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
