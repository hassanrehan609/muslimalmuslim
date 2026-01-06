import { useState } from "react";
import { Search, MessageCircle, Send, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIChatSearch = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to chatbot with the query
      navigate(`/chatbot?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.7s" }}>
      <form onSubmit={handleSubmit} className="relative group">
        <div
          className={`
            relative flex items-center gap-3 px-5 py-4 
            bg-white/10 backdrop-blur-lg rounded-2xl
            border-2 transition-all duration-300
            ${isFocused 
              ? "border-gold shadow-lg shadow-gold/20 bg-white/15" 
              : "border-white/20 hover:border-white/40"
            }
          `}
        >
          <MessageCircle className="w-5 h-5 text-gold flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Ask any Islamic question..."
            className="flex-1 bg-transparent text-white placeholder:text-white/60 outline-none text-base"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className={`
              p-2 rounded-xl transition-all duration-300
              ${query.trim() 
                ? "bg-gold text-gold-foreground hover:bg-gold/90 cursor-pointer" 
                : "bg-white/10 text-white/40 cursor-not-allowed"
              }
            `}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Decorative glow */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gold/20 via-transparent to-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      </form>

      {/* Quick suggestions */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {["How to pray?", "Dua for guidance", "Ramadan rules", "Zakat calculation"].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => navigate(`/chatbot?q=${encodeURIComponent(suggestion)}`)}
            className="px-3 py-1.5 text-sm text-white/70 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 hover:text-white"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AIChatSearch;
