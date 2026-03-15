import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VoiceChatButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  language: string;
}

// Extend Window for SpeechRecognition
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

const VoiceChatButton = ({ onTranscript, disabled, language }: VoiceChatButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");

  const getSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(language === "ur" 
        ? "آپ کا براؤزر آواز کی شناخت کی سہولت فراہم نہیں کرتا" 
        : "Your browser doesn't support speech recognition");
      return null;
    }
    return new SpeechRecognition();
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (disabled) return;
    
    const recognition = getSpeechRecognition();
    if (!recognition) return;

    recognition.lang = language === "ur" ? "ur-PK" : "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    transcriptRef.current = "";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        transcriptRef.current += finalTranscript;
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "aborted") {
        toast.error(language === "ur" 
          ? "آواز کی شناخت میں خرابی" 
          : "Speech recognition error");
      }
      setIsListening(false);
      setIsProcessing(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcriptRef.current.trim()) {
        setIsProcessing(true);
        onTranscript(transcriptRef.current.trim());
        setTimeout(() => setIsProcessing(false), 500);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [disabled, language, getSpeechRecognition, onTranscript]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, stopListening, startListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleListening}
      disabled={disabled || isProcessing}
      className={cn(
        "flex-shrink-0 transition-all duration-300",
        isListening 
          ? "text-destructive bg-destructive/10 hover:bg-destructive/20 animate-pulse" 
          : "text-muted-foreground hover:text-foreground"
      )}
      title={language === "ur" 
        ? (isListening ? "بولنا بند کریں" : "بول کر پوچھیں") 
        : (isListening ? "Stop listening" : "Voice input")}
    >
      {isProcessing ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isListening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </Button>
  );
};

export default VoiceChatButton;
