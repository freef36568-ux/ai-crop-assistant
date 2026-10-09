import { useState, useEffect, useRef, useCallback } from 'react';
import { LanguageCode } from '../types';
import { isSpeechRecognitionSupported, LANGUAGE_SPEECH_MAP } from '../services/speechService';

export interface UseSpeechRecognitionOptions {
  language: LanguageCode;
  onTranscriptChange?: (text: string) => void;
  onResultFinal?: (text: string) => void;
  onError?: (error: string) => void;
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  permissionError: boolean;
  isSupported: boolean;
  selectedLocale: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition({
  language,
  onTranscriptChange,
  onResultFinal,
  onError,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const isSupported = isSpeechRecognitionSupported();
  const selectedLocale = LANGUAGE_SPEECH_MAP[language] || 'en-IN';

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore already stopped error
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    setPermissionError(false);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      const msg = 'Speech recognition not supported in this browser';
      setError(msg);
      onError?.(msg);
      return;
    }

    // Stop existing instance if any
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    setError(null);
    setPermissionError(false);
    setInterimTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const msg = 'Speech recognition unavailable';
      setError(msg);
      onError?.(msg);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = selectedLocale;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const text = result[0]?.transcript || '';
          if (result.isFinal) {
            finalStr += text;
          } else {
            interimStr += text;
          }
        }

        if (interimStr) {
          setInterimTranscript(interimStr);
          onTranscriptChange?.(interimStr);
        }

        if (finalStr) {
          setTranscript((prev) => {
            const updated = prev ? `${prev} ${finalStr}`.trim() : finalStr.trim();
            onTranscriptChange?.(updated);
            onResultFinal?.(updated);
            return updated;
          });
          setInterimTranscript('');
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        setIsListening(false);

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setPermissionError(true);
          setError('Microphone permission denied');
          onError?.('Microphone permission denied');
        } else if (event.error === 'no-speech') {
          setIsListening(false);
        } else {
          setError(event.error || 'Recognition error');
          onError?.(event.error || 'Recognition error');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        recognitionRef.current = null;
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err: any) {
      console.warn('Could not start speech recognition:', err);
      setIsListening(false);
      setError('Could not start speech recognition');
      onError?.('Could not start speech recognition');
    }
  }, [isSupported, selectedLocale, onError, onTranscriptChange, onResultFinal]);

  // Clean up on unmount or language change
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, [language]);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    permissionError,
    isSupported,
    selectedLocale,
    startListening,
    stopListening,
    resetTranscript,
  };
}
