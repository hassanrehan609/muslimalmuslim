import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Moon, Calendar, Heart } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/quran", icon: BookOpen, label: "Quran" },
  { path: "/duas", icon: Moon, label: "Duas" },
  { path: "/calendar", icon: Calendar, label: "Calendar" },
  { path: "/favorites", icon: Heart, label: "Favorites" },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "fill-primary/20" : ""}`} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
