import { Link } from "react-router-dom";
import { ArrowLeft, Heart, BookOpen, Star, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavorites, FavoriteItem } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const FavoritesPage = () => {
  const { favorites, removeFavorite, getFavoritesByType } = useFavorites();
  const { t, language } = useLanguage();
  
  const duaFavorites = getFavoritesByType("dua");
  const nameFavorites = getFavoritesByType("name");
  const verseFavorites = getFavoritesByType("verse");

  const handleRemove = (item: FavoriteItem) => {
    removeFavorite(item.id);
    toast.success(language === "ur" ? "پسندیدہ سے ہٹا دیا گیا" : "Removed from favorites");
  };

  const renderEmptyState = (type: string, typeUrdu: string) => (
    <div className="text-center py-12">
      <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        {language === "ur" ? `ابھی تک کوئی ${typeUrdu} محفوظ نہیں` : `No ${type} saved yet`}
      </h3>
      <p className="text-muted-foreground text-sm">
        {language === "ur" 
          ? `کسی بھی ${typeUrdu} کو یہاں محفوظ کرنے کے لیے دل کے آئیکن پر ٹچ کریں۔`
          : `Tap the heart icon on any ${type.toLowerCase()} to save it here for quick access.`}
      </p>
    </div>
  );

  const renderDuaCard = (item: FavoriteItem) => (
    <Card key={item.id} className="p-5 bg-card border-border/50">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{item.title}</h3>
          {item.category && (
            <span className="text-xs text-gold">{item.category}</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleRemove(item)}
          className="h-8 w-8 text-muted-foreground hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="bg-primary/5 rounded-lg p-4 mb-3">
        <p className="text-xl font-arabic text-foreground text-center leading-loose" dir="rtl">
          {item.arabic}
        </p>
      </div>

      {item.transliteration && (
        <p className="text-sm text-muted-foreground italic mb-2">{item.transliteration}</p>
      )}
      {item.translation && (
        <p className="text-sm text-foreground">{item.translation}</p>
      )}
    </Card>
  );

  const renderNameCard = (item: FavoriteItem) => (
    <Card key={item.id} className="p-5 bg-card border-border/50">
      <div className="flex items-start justify-between mb-3">
        <Star className="w-5 h-5 text-gold" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleRemove(item)}
          className="h-8 w-8 text-muted-foreground hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <p className="text-3xl font-arabic text-foreground text-center mb-3" dir="rtl">
        {item.arabic}
      </p>

      <p className="text-lg font-semibold text-gold text-center mb-1">
        {item.transliteration}
      </p>
      <p className="text-sm text-muted-foreground text-center">
        {item.meaning}
      </p>
    </Card>
  );

  const renderVerseCard = (item: FavoriteItem) => (
    <Card key={item.id} className="p-5 bg-card border-border/50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium text-foreground">{item.title}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleRemove(item)}
          className="h-8 w-8 text-muted-foreground hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <p className="text-xl font-arabic text-foreground text-right leading-loose mb-4" dir="rtl">
        {item.arabic}
      </p>

      {item.translation && (
        <p className="text-sm text-muted-foreground">{item.translation}</p>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("page.favorites")}</h1>
            <p className="text-xs text-muted-foreground font-arabic">{t("page.favoritesArabic")}</p>
          </div>
          <div className="ml-auto">
            <span className="text-sm text-muted-foreground">
              {favorites.length} {t("favorites.saved")}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">{t("favorites.all")} ({favorites.length})</TabsTrigger>
            <TabsTrigger value="duas">{t("favorites.duas")} ({duaFavorites.length})</TabsTrigger>
            <TabsTrigger value="names">{t("favorites.names")} ({nameFavorites.length})</TabsTrigger>
            <TabsTrigger value="verses">{t("favorites.verses")} ({verseFavorites.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">{t("favorites.noFavorites")}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t("favorites.startExploring")}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link to="/duas">
                    <Button variant="outline">{t("favorites.browseDuas")}</Button>
                  </Link>
                  <Link to="/names-of-allah">
                    <Button variant="outline">{t("favorites.99Names")}</Button>
                  </Link>
                  <Link to="/quran">
                    <Button variant="outline">{t("favorites.holyQuran")}</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {favorites.map((item) => {
                  if (item.type === "dua") return renderDuaCard(item);
                  if (item.type === "name") return renderNameCard(item);
                  if (item.type === "verse") return renderVerseCard(item);
                  return null;
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="duas">
            {duaFavorites.length === 0 
              ? renderEmptyState("Duas", "دعائیں")
              : <div className="space-y-4">{duaFavorites.map(renderDuaCard)}</div>
            }
          </TabsContent>

          <TabsContent value="names">
            {nameFavorites.length === 0 
              ? renderEmptyState("Names", "نام")
              : <div className="grid sm:grid-cols-2 gap-4">{nameFavorites.map(renderNameCard)}</div>
            }
          </TabsContent>

          <TabsContent value="verses">
            {verseFavorites.length === 0 
              ? renderEmptyState("Verses", "آیات")
              : <div className="space-y-4">{verseFavorites.map(renderVerseCard)}</div>
            }
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FavoritesPage;
