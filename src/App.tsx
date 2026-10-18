import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useServiceWorker } from "./hooks/useServiceWorker";
import { usePrayerNotifications } from "./hooks/usePrayerNotifications";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useAuth } from "./hooks/useAuth";
import LiquidGlassLayer from "./components/LiquidGlassLayer";
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
import ProfilePage from "./pages/ProfilePage";
import ManzilPage from "./pages/ManzilPage";
import OAuthConsent from "./pages/OAuthConsent";
import PrayerTimesPage from "./pages/PrayerTimesPage";
import CommunityPage from "./pages/CommunityPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { isOnline } = useServiceWorker();
  usePrayerNotifications();

  return (
    <>
      <LiquidGlassLayer />

      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-gold text-gold-foreground text-center py-2 text-sm z-[100]">
          You're offline. Some features may be limited.
        </div>
      )}
      <div className={!isOnline ? "pt-10" : ""}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/duas" element={<ProtectedRoute><DuasPage /></ProtectedRoute>} />
          <Route path="/names-of-allah" element={<ProtectedRoute><NamesOfAllahPage /></ProtectedRoute>} />
          <Route path="/tasbeeh" element={<ProtectedRoute><TasbeehPage /></ProtectedRoute>} />
          <Route path="/quran" element={<ProtectedRoute><QuranPage /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><HijriCalendarPage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/adhan-settings" element={<ProtectedRoute><AdhanSettingsPage /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
          <Route path="/chatbot/:threadId" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
          <Route path="/prayer-times" element={<ProtectedRoute><PrayerTimesPage /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
          <Route path="/kalmas" element={<ProtectedRoute><KalmasPage /></ProtectedRoute>} />
          <Route path="/namaz" element={<ProtectedRoute><NamazPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/manzil" element={<ManzilPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
