import { LanguageCode } from '../types';

export type SpeechState = 'idle' | 'listening' | 'processing' | 'completed' | 'error';

interface SpeechRecognitionOptions {
  lang: LanguageCode;
  onResult: (transcript: string) => void;
  onError: (error: string) => void;
  onStateChange: (state: SpeechState) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

let activeRecognition: any = null;

export const LANGUAGE_SPEECH_MAP: Record<LanguageCode, string> = {
  en: 'en-IN',
  te: 'te-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  as: 'as-IN',
  ur: 'ur-IN',
};

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function startSpeechRecognition(options: SpeechRecognitionOptions): () => void {
  const { lang, onResult, onError, onStateChange } = options;

  if (!isSpeechRecognitionSupported()) {
    onError('Speech recognition not supported');
    onStateChange('error');
    return () => {};
  }

  stopSpeechRecognition();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.lang = LANGUAGE_SPEECH_MAP[lang] || 'en-IN';

  onStateChange('listening');

  let finalTranscript = '';

  recognition.onstart = () => {
    onStateChange('listening');
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    const currentText = finalTranscript || interimTranscript;
    if (currentText) {
      onResult(currentText);
    }
  };

  recognition.onerror = (event: any) => {
    console.warn('Speech recognition error:', event.error);
    onStateChange('error');
    if (event.error === 'not-allowed') {
      onError('Microphone permission denied');
    } else {
      onError(event.error || 'Speech recognition failed');
    }
  };

  recognition.onend = () => {
    if (finalTranscript) {
      onStateChange('completed');
    } else {
      onStateChange('idle');
    }
    activeRecognition = null;
  };

  try {
    recognition.start();
    activeRecognition = recognition;
  } catch {
    onStateChange('error');
    onError('Could not start microphone');
  }

  return () => {
    stopSpeechRecognition();
  };
}

export function stopSpeechRecognition(): void {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch {
      // Ignore
    }
    activeRecognition = null;
  }
}
