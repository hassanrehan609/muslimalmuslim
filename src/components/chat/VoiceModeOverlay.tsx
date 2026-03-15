import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, X, Volume2, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface VoiceModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (text: string) => Promise<string>;
  language: string;
}

type VoiceState = "idle" | "listening" | "processing" | "speaking";

const VoiceModeOverlay = ({ isOpen, onClose, onSendMessage, language }: VoiceModeOverlayProps) => {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState("");
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAll = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setVoiceState("idle");
  }, []);

  const playResponse = useCallback(async (text: string) => {
    setVoiceState("speaking");
    setResponseText(text);

    try {
      const response = await supabase.functions.invoke('elevenlabs-kalmas-tts', {
        body: { text: text.substring(0, 4000) }
      });

      if (response.error || !response.data?.audioContent) {
        throw new Error("TTS failed");
      }

      const audioUrl = `data:audio/mpeg;base64,${response.data.audioContent}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setVoiceState("idle");
        audioRef.current = null;
        // Auto-start listening again after response
        setTimeout(() => startListening(), 500);
      };

      audio.onerror = () => {
        setVoiceState("idle");
        audioRef.current = null;
      };

      await audio.play();
    } catch {
      toast.error(language === "ur" ? "آواز چلانے میں خرابی" : "Error playing audio");
      setVoiceState("idle");
    }
  }, [language]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(language === "ur" 
        ? "آپ کا براؤزر آواز کی شناخت کی سہولت فراہم نہیں کرتا" 
        : "Your browser doesn't support speech recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "ur" ? "ur-PK" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    let finalText = "";

    recognition.onstart = () => {
      setVoiceState("listening");
      setTranscript("");
      setResponseText("");
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      finalText = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(finalText || interim);
    };

    recognition.onend = async () => {
      const text = finalText.trim();
      if (text) {
        setVoiceState("processing");
        setTranscript(text);
        try {
          const response = await onSendMessage(text);
          if (response) {
            await playResponse(response);
          } else {
            setVoiceState("idle");
          }
        } catch {
          setVoiceState("idle");
        }
      } else {
        setVoiceState("idle");
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error !== "aborted" && event.error !== "no-speech") {
        toast.error(language === "ur" ? "آواز کی شناخت میں خرابی" : "Speech recognition error");
      }
      setVoiceState("idle");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, onSendMessage, playResponse]);

  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stopAll();
    }
    return () => stopAll();
  }, [isOpen]);

  if (!isOpen) return null;

  const stateConfig = {
    idle: {
      icon: <Mic className="w-10 h-10" />,
      label: language === "ur" ? "مائیکروفون دبائیں" : "Tap to speak",
      color: "text-muted-foreground",
      ringColor: "ring-muted",
    },
    listening: {
      icon: <Mic className="w-10 h-10" />,
      label: language === "ur" ? "سن رہا ہوں..." : "Listening...",
      color: "text-destructive",
      ringColor: "ring-destructive",
    },
    processing: {
      icon: <Loader2 className="w-10 h-10 animate-spin" />,
      label: language === "ur" ? "جواب تیار ہو رہا ہے..." : "Thinking...",
      color: "text-primary",
      ringColor: "ring-primary",
    },
    speaking: {
      icon: <Volume2 className="w-10 h-10" />,
      label: language === "ur" ? "جواب سنیں" : "Speaking...",
      color: "text-gold",
      ringColor: "ring-gold",
    },
  };

  const current = stateConfig[voiceState];

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => { stopAll(); onClose(); }}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* AI Avatar */}
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
          <Bot className="w-8 h-8 text-primary-foreground" />
        </div>
      </div>

      {/* Voice indicator */}
      <button
        onClick={() => {
          if (voiceState === "idle") startListening();
          else if (voiceState === "listening") recognitionRef.current?.stop();
          else if (voiceState === "speaking") { audioRef.current?.pause(); setVoiceState("idle"); }
        }}
        className={cn(
          "w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300",
          "ring-4 ring-offset-4 ring-offset-background",
          current.color,
          current.ringColor,
          voiceState === "listening" && "animate-pulse scale-110",
          voiceState === "speaking" && "animate-pulse",
        )}
      >
        {current.icon}
      </button>

      {/* Status */}
      <p className="mt-6 text-lg font-medium text-foreground">{current.label}</p>

      {/* Transcript */}
      {transcript && (
        <div className="mt-4 max-w-md px-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            {language === "ur" ? "آپ نے کہا:" : "You said:"}
          </p>
          <p className="text-foreground">{transcript}</p>
        </div>
      )}

      {/* Response text */}
      {responseText && voiceState === "speaking" && (
        <div className="mt-4 max-w-md px-6 text-center max-h-40 overflow-y-auto">
          <p className="text-sm text-muted-foreground mb-1">
            {language === "ur" ? "جواب:" : "Response:"}
          </p>
          <p className="text-sm text-foreground">{responseText}</p>
        </div>
      )}

      {/* Hint */}
      <p className="absolute bottom-8 text-xs text-muted-foreground">
        {language === "ur" ? "بند کرنے کے لیے × دبائیں" : "Press × to exit voice mode"}
      </p>
    </div>
  );
};

export default VoiceModeOverlay;
