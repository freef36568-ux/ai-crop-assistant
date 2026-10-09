import React, { useState, useRef, useEffect } from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import {
  X,
  Send,
  Sparkles,
  Trash2,
  Bot,
  User,
  Sprout,
  Mic,
  MicOff,
  AlertCircle,
} from 'lucide-react';

export const AssistantDrawer: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    chatMessages,
    sendChatMessage,
    clearChat,
    analysisResult,
    cropName,
  } = useAnalysis();

  const { currentLanguage, t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isListening,
    startListening,
    stopListening,
    permissionError,
    isSupported: isSpeechSupported,
  } = useSpeechRecognition({
    language: currentLanguage,
    onTranscriptChange: (text) => {
      if (text) {
        setInputText(text);
      }
    },
    onResultFinal: (text) => {
      if (text) {
        setInputText(text);
      }
    },
    onError: (err) => {
      if (err.includes('permission') || permissionError) {
        setVoiceNotice(t('chat.micDenied'));
      } else if (!isSpeechSupported) {
        setVoiceNotice(t('chat.notSupported'));
      } else {
        setVoiceNotice(err);
      }
    },
  });

  const contextLabel = analysisResult
    ? `${analysisResult.cropName} (${analysisResult.diseaseName})`
    : cropName
    ? cropName
    : null;

  const quickPrompts = [
    t('chat.quickPrompt1'),
    t('chat.quickPrompt2'),
    t('chat.quickPrompt3'),
    t('chat.quickPrompt4'),
  ];

  useEffect(() => {
    if (isAssistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAssistantOpen]);

  if (!isAssistantOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    if (isListening) {
      stopListening();
    }

    setInputText('');
    setVoiceNotice(null);
    setIsSending(true);
    try {
      await sendChatMessage(text);
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleVoice = () => {
    setVoiceNotice(null);
    if (!isSpeechSupported) {
      setVoiceNotice(t('chat.notSupported'));
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg leading-tight flex items-center gap-1.5">
                  <span>{t('chat.headerTitle')}</span>
                  <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
                </h3>
                <span className="text-xs text-amber-100 font-medium">
                  {t('chat.headerSubtitle')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                title={t('chat.clearChat')}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isListening) stopListening();
                  setIsAssistantOpen(false);
                }}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Context Badge if crop is active */}
          {contextLabel && (
            <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 flex items-center gap-2 text-xs font-semibold text-amber-900 shrink-0">
              <Sprout className="w-4 h-4 text-amber-700" />
              <span>{t('chat.contextBadge')}</span>
              <strong className="bg-amber-200/70 px-2 py-0.5 rounded-md text-amber-950 font-bold">
                {contextLabel}
              </strong>
            </div>
          )}

          {/* Voice Error Notice banner if any */}
          {voiceNotice && (
            <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 flex items-center justify-between gap-2 text-xs font-semibold text-rose-800 shrink-0 animate-in fade-in">
              <div className="flex items-center gap-1.5 min-w-0">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="truncate">{voiceNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setVoiceNotice(null)}
                className="text-rose-600 hover:text-rose-900 font-bold text-xs shrink-0"
              >
                ✕
              </button>
            </div>
          )}

          {/* Messages Timeline */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {chatMessages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    isAssistant ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-sm shadow-sm space-y-2 ${
                      isAssistant
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                        : 'bg-agri-600 text-white font-medium rounded-tr-sm'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-agri-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 rounded-xl p-3 w-fit animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
                <span>AI Crop Doctor is analyzing your question...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase mb-2">
              Suggested Questions
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors border border-slate-200/80 shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer with Microphone Voice Input Button */}
          <div className="p-3 sm:p-4 pb-6 sm:pb-4 bg-white border-t border-slate-200 shrink-0 space-y-2">
            {isListening && (
              <div className="flex items-center justify-between px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-xs font-bold animate-pulse">
                <span className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-amber-600 animate-bounce" />
                  {t('chat.listening')}
                </span>
                <button
                  type="button"
                  onClick={stopListening}
                  className="text-amber-700 hover:text-amber-950 underline text-xs"
                >
                  {t('chat.stopListening')}
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 border-slate-200'
                }`}
                title={t('chat.micButton')}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? t('chat.listening') : t('chat.inputPlaceholder')}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-800 font-medium placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-all active:scale-95 shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
