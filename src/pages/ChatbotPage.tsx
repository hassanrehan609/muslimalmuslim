import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, Send, Bot, User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const ChatbotPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { t, language } = useLanguage();
  
  const getWelcomeMessage = () => {
    return language === "ur"
      ? "السلام علیکم! میں آپ کا اسلامی علم کا معاون ہوں۔ اسلام، قرآن، حدیث، نماز، یا روزانہ اسلامی معاملات کے بارے میں کوئی بھی سوال پوچھیں۔ میں آپ کی کیسے مدد کر سکتا ہوں؟"
      : "Assalamu Alaikum! I am your Islamic knowledge assistant. Feel free to ask me any questions about Islam, Quran, Hadith, prayers, or daily Islamic practices. How can I help you today?";
  };
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: getWelcomeMessage()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasProcessedInitialQuery, setHasProcessedInitialQuery] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/islamic-chat`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle initial query from URL
  useEffect(() => {
    if (initialQuery && !hasProcessedInitialQuery) {
      setHasProcessedInitialQuery(true);
      setInput(initialQuery);
      // Auto-send after a short delay
      setTimeout(() => {
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
        sendMessageWithContent(initialQuery);
      }, 500);
    }
  }, [initialQuery, hasProcessedInitialQuery]);

  const sendMessageWithContent = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Response error:", response.status, errorData);
        throw new Error(`Server error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Add assistant message placeholder immediately
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) {
              assistantContent += deltaContent;
              setMessages(prev => {
                return prev.map((m, i) => 
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              });
            }
          } catch {
            // Incomplete JSON, keep in buffer and continue
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Ensure final content is set
      if (assistantContent) {
        setMessages(prev => prev.map((m, i) => 
          i === prev.length - 1 ? { ...m, content: assistantContent } : m
        ));
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        // Remove empty assistant placeholder if exists
        const filtered = prev.filter((m, i) => !(i === prev.length - 1 && m.role === "assistant" && !m.content));
        return [
          ...filtered,
          { role: "assistant", content: language === "ur" 
            ? "معذرت، کوئی خرابی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔" 
            : "I apologize, but I encountered an error. Please try again in a moment." }
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    sendMessageWithContent(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h1 className="font-semibold">
              {language === "ur" ? "اسلامی AI معاون" : "Islamic AI Assistant"}
            </h1>
            <p className="text-xs text-primary-foreground/70">
              {language === "ur" ? "اسلام، قرآن اور حدیث کے بارے میں پوچھیں" : "Ask about Islam, Quran & Hadith"}
            </p>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "user" ? "bg-gold" : "bg-primary"
              }`}>
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-gold-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === "user"
                  ? "bg-gold text-gold-foreground rounded-tr-sm"
                  : "bg-muted text-foreground rounded-tl-sm"
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted p-4 rounded-2xl rounded-tl-sm">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === "ur" ? "اسلام، قرآن، نماز کے بارے میں پوچھیں..." : "Ask about Islam, Quran, prayers..."}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gold hover:bg-gold/90 text-gold-foreground"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
