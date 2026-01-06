import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useServiceWorker } from "./hooks/useServiceWorker";
import { usePrayerNotifications } from "./hooks/usePrayerNotifications";
import Index from "./pages/Index";
import DuasPage from "./pages/DuasPage";
import NamesOfAllahPage from "./pages/NamesOfAllahPage";
import TasbeehPage from "./pages/TasbeehPage";
import QuranPage from "./pages/QuranPage";
import HijriCalendarPage from "./pages/HijriCalendarPage";
import FavoritesPage from "./pages/FavoritesPage";
import AdhanSettingsPage from "./pages/AdhanSettingsPage";
import AuthPage from "./pages/AuthPage";
import ChatbotPage from "./pages/ChatbotPage";
import KalmasPage from "./pages/KalmasPage";
import NamazPage from "./pages/NamazPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isOnline } = useServiceWorker();
  usePrayerNotifications(); // Initialize prayer notifications

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-gold text-gold-foreground text-center py-2 text-sm z-[100]">
          You're offline. Some features may be limited.
        </div>
      )}
      <div className={!isOnline ? "pt-10" : ""}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/duas" element={<DuasPage />} />
          <Route path="/names-of-allah" element={<NamesOfAllahPage />} />
          <Route path="/tasbeeh" element={<TasbeehPage />} />
          <Route path="/quran" element={<QuranPage />} />
          <Route path="/calendar" element={<HijriCalendarPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/adhan-settings" element={<AdhanSettingsPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/kalmas" element={<KalmasPage />} />
          <Route path="/namaz" element={<NamazPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
