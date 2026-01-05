import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DuasPage from "./pages/DuasPage";
import NamesOfAllahPage from "./pages/NamesOfAllahPage";
import TasbeehPage from "./pages/TasbeehPage";
import QuranPage from "./pages/QuranPage";
import HijriCalendarPage from "./pages/HijriCalendarPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";
import MobileNav from "./components/MobileNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/duas" element={<DuasPage />} />
            <Route path="/names-of-allah" element={<NamesOfAllahPage />} />
            <Route path="/tasbeeh" element={<TasbeehPage />} />
            <Route path="/quran" element={<QuranPage />} />
            <Route path="/calendar" element={<HijriCalendarPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MobileNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
