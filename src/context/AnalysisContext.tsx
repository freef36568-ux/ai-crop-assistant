import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  AnalysisResult,
  CropDetectionResult,
  ChatMessage,
  CropInfo,
} from '../types';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { aiService } from '../services/aiService';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';

interface AnalysisContextType {
  cropName: string;
  setCropName: (name: string) => void;
  imageDataUrl: string | null;
  setImageDataUrl: (url: string | null) => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  analysisStageMessage: string;
  analysisPercent: number;
  runAnalysis: (cropOverride?: string, imageOverride?: string) => Promise<AnalysisResult | null>;
  cancelAnalysis: () => void;
  resetAnalysis: () => void;
  isDetectingCrop: boolean;
  detectedCropResult: CropDetectionResult | null;
  cropDetectionError: string | null;
  detectCrop: (imageUrl: string) => Promise<CropDetectionResult | null>;
  history: AnalysisResult[];
  refreshHistory: () => Promise<void>;
  deleteHistoryItem: (id: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  selectedCropDetail: CropInfo | null;
  setSelectedCropDetail: (crop: CropInfo | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLanguage, t } = useLanguage();
  const { user } = useAuth();

  const [cropName, setCropName] = useState<string>('');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStageMessage, setAnalysisStageMessage] = useState<string>('analyzer.analyzing');
  const [analysisPercent, setAnalysisPercent] = useState<number>(0);

  const [isDetectingCrop, setIsDetectingCrop] = useState<boolean>(false);
  const [detectedCropResult, setDetectedCropResult] = useState<CropDetectionResult | null>(null);
  const [cropDetectionError, setCropDetectionError] = useState<string | null>(null);

  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [selectedCropDetail, setSelectedCropDetail] = useState<CropInfo | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: t('chat.welcomeMessage'),
      timestamp: new Date().toISOString(),
    },
  ]);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    refreshHistory();
  }, []);

  const refreshHistory = async () => {
    try {
      const items = await storageService.getAnalyses(user?.id);
      setHistory(items);
    } catch (e) {
      console.error('Failed to fetch history:', e);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    await storageService.deleteAnalysis(id, user?.id);
    await refreshHistory();
  };

  const clearAllHistory = async () => {
    await storageService.clearAllAnalyses(user?.id);
    await refreshHistory();
  };

  const detectCrop = async (imageUrl: string): Promise<CropDetectionResult | null> => {
    setIsDetectingCrop(true);
    setCropDetectionError(null);

    try {
      const res = await aiService.detectCropFromImage(imageUrl, currentLanguage);
      setIsDetectingCrop(false);

      if (res) {
        setDetectedCropResult(res);
        if (res.is_plant && res.cropName && res.cropName.toLowerCase() !== 'unknown') {
          setCropName(res.cropName);
        } else {
          setCropName('');
          setCropDetectionError(!res.is_plant ? t('analyzer.nonPlantError') : t('analyzer.cropUnidentifiedError'));
        }
      }
      return res;
    } catch {
      setIsDetectingCrop(false);
      const errMsg = t('analyzer.cropUnidentifiedError');
      setCropDetectionError(errMsg);
      return null;
    }
  };

  const handleSetImageDataUrl = (url: string | null) => {
    setImageDataUrl(url);
    setAnalysisResult(null);
    setDetectedCropResult(null);
    setCropDetectionError(null);

    if (url) {
      detectCrop(url);
    }
  };

  const runAnalysis = async (
    cropOverride?: string,
    imageOverride?: string
  ): Promise<AnalysisResult | null> => {
    const targetCrop = cropOverride !== undefined ? cropOverride : cropName;
    const targetImage = imageOverride !== undefined ? imageOverride : imageDataUrl;

    if (!targetImage) {
      return null;
    }

    setIsAnalyzing(true);
    setAnalysisPercent(15);
    setAnalysisStageMessage('analyzer.scanningMessage1');

    abortControllerRef.current = new AbortController();

    try {
      const result = await aiService.analyzeCropDisease(
        targetCrop || 'Crop',
        targetImage,
        currentLanguage,
        abortControllerRef.current.signal,
        (msgKey, percent) => {
          setAnalysisStageMessage(msgKey);
          setAnalysisPercent(percent);
        }
      );

      if (result) {
        if (result.cropName) {
          setCropName(result.cropName);
        }
        setAnalysisResult(result);
        setIsAnalyzing(false);
        setAnalysisPercent(100);

        await storageService.saveAnalysis(result, user?.id);
        await refreshHistory();
      }

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#16a34a', '#86efac', '#f59e0b'],
        });
      } catch {
        // ignore
      }

      return result;
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Analysis error:', err);
      }
      setIsAnalyzing(false);
      setAnalysisPercent(0);
      return null;
    }
  };

  const cancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsAnalyzing(false);
    setAnalysisPercent(0);
  };

  const resetAnalysis = () => {
    setCropName('');
    setImageDataUrl(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setAnalysisPercent(0);
    setDetectedCropResult(null);
    setCropDetectionError(null);
  };

  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);

    const activeContext = analysisResult
      ? `Analyzing Crop: ${analysisResult.cropName}, Disease: ${analysisResult.diseaseName}, Severity: ${analysisResult.severity}`
      : cropName
      ? `Discussing crop: ${cropName}`
      : undefined;

    try {
      const responseText = await aiService.chatWithAssistant(
        newMessages,
        activeContext,
        currentLanguage
      );

      const assistantMsg: ChatMessage = {
        id: `msg_ast_${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error('Chat error:', e);
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'assistant',
        text: 'Apologies, I encountered a temporary connection issue. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: t('chat.welcomeMessage'),
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <AnalysisContext.Provider
      value={{
        cropName,
        setCropName,
        imageDataUrl,
        setImageDataUrl: handleSetImageDataUrl,
        analysisResult,
        setAnalysisResult,
        isAnalyzing,
        analysisStageMessage,
        analysisPercent,
        runAnalysis,
        cancelAnalysis,
        resetAnalysis,
        isDetectingCrop,
        detectedCropResult,
        cropDetectionError,
        detectCrop,
        history,
        refreshHistory,
        deleteHistoryItem,
        clearAllHistory,
        isAssistantOpen,
        setIsAssistantOpen,
        chatMessages,
        sendChatMessage,
        clearChat,
        selectedCropDetail,
        setSelectedCropDetail,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export function useAnalysis(): AnalysisContextType {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
