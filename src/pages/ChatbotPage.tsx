import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { History, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Send, Bot, User, Loader2, Volume2, Pause, Paperclip, Image, FileText, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import VoiceChatButton from "@/components/chat/VoiceChatButton";
import VoiceModeOverlay from "@/components/chat/VoiceModeOverlay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
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
    { role: "assistant", content: getWelcomeMessage() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasProcessedInitialQuery, setHasProcessedInitialQuery] = useState(false);
  const [playingMessage, setPlayingMessage] = useState<number | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<number | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const { threadId } = useParams();
  const navigate = useNavigate();
  const threadRef = useRef<string | undefined>(threadId);
  const [threads, setThreads] = useState<{ id: string; title: string; updated_at: string }[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const loadThreads = useCallback(async () => {
    const { data } = await supabase.from("chat_threads").select("id,title,updated_at").order("updated_at", { ascending: false }).limit(50);
    setThreads(data || []);
  }, []);

  useEffect(() => { loadThreads(); }, [loadThreads]);

  // Load the messages of the thread in the URL
  useEffect(() => {
    threadRef.current = threadId;
    if (!threadId) { setMessages([{ role: "assistant", content: getWelcomeMessage() }]); return; }
    supabase.from("chat_messages").select("role,content").eq("thread_id", threadId).order("created_at")
      .then(({ data, error }) => {
        if (error) { console.error(error); return; }
        setMessages([{ role: "assistant", content: getWelcomeMessage() }, ...((data || []) as Message[])]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const persistExchange = useCallback(async (userText: string, assistantText: string) => {
    if (!assistantText) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    let id = threadRef.current;
    if (!id) {
      const { data, error } = await supabase.from("chat_threads").insert({ user_id: user.id, title: userText.slice(0, 60) }).select("id").single();
      if (error || !data) { console.error("thread create failed", error); return; }
      id = data.id; threadRef.current = id;
      navigate(`/chatbot/${id}`, { replace: true });
    } else {
      await supabase.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", id);
    }
    const t0 = Date.now();
    const { error } = await supabase.from("chat_messages").insert([
      { user_id: user.id, thread_id: id, role: "user", content: userText, created_at: new Date(t0).toISOString() },
      { user_id: user.id, thread_id: id, role: "assistant", content: assistantText, created_at: new Date(t0 + 1).toISOString() },
    ]);
    if (error) console.error("message save failed", error);
    loadThreads();
  }, [navigate, loadThreads]);

  const deleteThread = async (id: string) => {
    await supabase.from("chat_messages").delete().eq("thread_id", id);
    await supabase.from("chat_threads").delete().eq("id", id);
    if (id === threadId) navigate("/chatbot");
    loadThreads();
  };

  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/islamic-chat`;

  // Keep messagesRef in sync for voice mode callback
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (initialQuery && !hasProcessedInitialQuery) {
      setHasProcessedInitialQuery(true);
      setInput(initialQuery);
      setTimeout(() => {
        sendMessageWithContent(initialQuery);
      }, 500);
    }
  }, [initialQuery, hasProcessedInitialQuery]);

  const playMessageAudio = async (text: string, index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (playingMessage === index) {
      setPlayingMessage(null);
      return;
    }

    setLoadingAudio(index);
    setPlayingMessage(null);

    try {
      const response = await supabase.functions.invoke('elevenlabs-kalmas-tts', {
        body: { text: text.substring(0, 4000) }
      });

      if (response.error) throw new Error(response.error.message);
      if (!response.data?.audioContent) throw new Error("No audio");

      const audioUrl = `data:audio/mpeg;base64,${response.data.audioContent}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => { setPlayingMessage(null); audioRef.current = null; };
      audio.onerror = () => {
        toast.error(language === "ur" ? "آڈیو چلانے میں خرابی" : "Error playing audio");
        setPlayingMessage(null); audioRef.current = null;
      };

      await audio.play();
      setPlayingMessage(index);
    } catch (error) {
      console.error("TTS error:", error);
      toast.error(language === "ur" ? "آڈیو دستیاب نہیں" : "Audio not available");
    } finally {
      setLoadingAudio(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(language === "ur" ? "صرف تصاویر اپ لوڈ کریں" : "Only images are supported");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      const userMessage: Message = {
        role: "user",
        content: language === "ur" ? "یہ تصویر دیکھیں" : "Please look at this image",
        imageUrl
      };
      setMessages(prev => [...prev, userMessage]);
      // For now just acknowledge - full vision would need multimodal model
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: language === "ur"
            ? "شکریہ تصویر بھیجنے کے لیے۔ براہ کرم اپنا سوال ٹائپ کریں تاکہ میں آپ کی مدد کر سکوں۔"
            : "Thank you for sharing the image. Please type your question so I can assist you."
        }]);
      }, 500);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const getAuthenticatedHeaders = useCallback(async () => {
    const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    let { data: { session } } = await supabase.auth.getSession();
    let accessToken = session?.access_token;

    if (!accessToken) {
      const { data: refreshed } = await supabase.auth.refreshSession();
      accessToken = refreshed.session?.access_token;
    }

    if (!accessToken || accessToken === publishableKey) {
      toast.error(language === "ur" 
        ? "سیشن ختم ہو گیا۔ براہ کرم دوبارہ سائن ان کریں۔" 
        : "Session expired. Please sign in again.");
      throw new Error("Not authenticated");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      apikey: publishableKey,
    };
  }, [language]);

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
        headers: await getAuthenticatedHeaders(),
        body: JSON.stringify({ messages: [...messages, userMessage].slice(-40).map(m => ({ role: m.role, content: m.content })) }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Response error:", response.status, errorData);
        throw new Error(`Server error: ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

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
              setMessages(prev => prev.map((m, i) => 
                i === prev.length - 1 ? { ...m, content: assistantContent } : m
              ));
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      if (assistantContent) {
        setMessages(prev => prev.map((m, i) => 
          i === prev.length - 1 ? { ...m, content: assistantContent } : m
        ));
        persistExchange(userMessage.content, assistantContent);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
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

  const handleVoiceTranscript = useCallback((text: string) => {
    sendMessageWithContent(text);
  }, []);

  // Voice mode: send message and return the response text
  const handleVoiceModeSend = useCallback(async (content: string): Promise<string> => {
    if (!content.trim()) return "";

    const userMessage: Message = { role: "user", content: content.trim() };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: await getAuthenticatedHeaders(),
        body: JSON.stringify({
          messages: [...messagesRef.current, userMessage].slice(-40).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok || !response.body) throw new Error("Server error");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

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
          if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages(prev => prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: assistantContent } : m
              ));
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      persistExchange(userMessage.content, assistantContent);
      return assistantContent;
    } catch {
      const errMsg = language === "ur"
        ? "معذرت، کوئی خرابی ہوئی۔"
        : "Sorry, an error occurred.";
      setMessages(prev => [...prev, { role: "assistant", content: errMsg }]);
      return errMsg;
    }
  }, [CHAT_URL, getAuthenticatedHeaders, language, persistExchange]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3 flex-1">
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
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/chatbot")} aria-label="New chat">
          <Plus className="w-5 h-5" />
        </Button>
        <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" aria-label="Chat history">
              <History className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader><SheetTitle>{language === "ur" ? "چیٹ کی تاریخ" : "Chat history"}</SheetTitle></SheetHeader>
            <Button className="w-full my-4" onClick={() => { navigate("/chatbot"); setHistoryOpen(false); }}>
              <Plus className="w-4 h-4 mr-1" />{language === "ur" ? "نئی چیٹ" : "New chat"}
            </Button>
            <div className="space-y-1 overflow-y-auto max-h-[75vh]">
              {threads.length === 0 && <p className="text-sm text-muted-foreground">{language === "ur" ? "ابھی کوئی چیٹ نہیں" : "No chats yet"}</p>}
              {threads.map((th) => (
                <div key={th.id} className={`flex items-center gap-1 rounded-lg ${th.id === threadId ? "bg-primary/10" : ""}`}>
                  <button className="flex-1 text-left p-2 text-sm truncate text-foreground" onClick={() => { navigate(`/chatbot/${th.id}`); setHistoryOpen(false); }}>
                    {th.title}
                  </button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => deleteThread(th.id)} aria-label="Delete chat">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
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
              <div className={`max-w-[80%] rounded-2xl ${
                message.role === "user"
                  ? "bg-gold text-gold-foreground rounded-tr-sm"
                  : "bg-muted text-foreground rounded-tl-sm"
              }`}>
                {message.imageUrl && (
                  <img src={message.imageUrl} alt="Uploaded" className="rounded-t-2xl max-h-48 w-full object-cover" />
                )}
                <div className="p-4">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {/* Listen button for assistant messages */}
                {message.role === "assistant" && message.content && (
                  <div className="px-4 pb-3 flex items-center gap-2">
                    <button
                      onClick={() => playMessageAudio(message.content, index)}
                      disabled={loadingAudio === index}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {loadingAudio === index ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : playingMessage === index ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                      {language === "ur" ? "سنیں" : "Listen"}
                    </button>
                  </div>
                )}
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
        <div className="max-w-2xl mx-auto flex gap-2 items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-foreground">
                <Paperclip className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Image className="w-4 h-4 mr-2" />
                {language === "ur" ? "تصویر" : "Image"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                toast.info(language === "ur" ? "دستاویز کی سہولت جلد آ رہی ہے" : "Document support coming soon");
              }}>
                <FileText className="w-4 h-4 mr-2" />
                {language === "ur" ? "دستاویز" : "Document"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <VoiceChatButton 
            onTranscript={handleVoiceTranscript}
            disabled={isLoading}
            language={language}
          />
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
            className="bg-gold hover:bg-gold/90 text-gold-foreground flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVoiceMode(true)}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            title={language === "ur" ? "لائیو وائس چیٹ" : "Live voice chat"}
          >
            <Mic className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Voice Mode Overlay */}
      <VoiceModeOverlay
        isOpen={isVoiceMode}
        onClose={() => setIsVoiceMode(false)}
        onSendMessage={handleVoiceModeSend}
        language={language}
      />
    </div>
  );
};

export default ChatbotPage;
