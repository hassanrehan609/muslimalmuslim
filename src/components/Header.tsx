import { Moon, Star } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Moon className="w-8 h-8 text-primary fill-primary" />
            <Star className="w-3 h-3 text-gold absolute -top-1 -right-1 fill-gold" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Muslim al Muslim</h1>
            <p className="text-xs text-muted-foreground font-arabic">مسلم المسلم</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#prayers" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Prayer Times</a>
          <a href="#qibla" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Qibla</a>
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
