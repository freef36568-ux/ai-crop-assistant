import { AnalysisResult, ChatMessage, CropDetectionResult, LanguageCode, SeverityLevel } from '../types';
import { matchCropFromInput } from './cropDatabase';
import { getGeminiApiKey, isSupabaseConfigured, supabase } from '../lib/supabase';

// Local Express API Base URL (defaults to relative /api which Vite proxies to backend)
const EXPRESS_API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export interface DiagnosticProgressCallback {
  (messageKey: string, percent: number): void;
}

export const aiService = {
  async detectCropFromImage(
    imageDataUrl: string,
    language: LanguageCode,
    signal?: AbortSignal
  ): Promise<CropDetectionResult> {
    if (!imageDataUrl || !imageDataUrl.startsWith('data:image')) {
      return {
        crop_name: 'Unknown',
        cropName: 'Unknown',
        confidence: 0,
        identified: false,
        is_certain: false,
        isCertain: false,
        is_plant: false,
        isRecognized: false,
        reason: 'unidentified',
        message: 'Invalid image format',
      };
    }

    // 1. Check Express local backend if available
    try {
      const res = await fetch(`${EXPRESS_API_URL}/detect-crop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({ image: imageDataUrl, language }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && (data.crop_name || data.cropName)) {
          const crop = data.cropName || data.crop_name || 'Unknown';
          const isPlant = Boolean(data.is_plant ?? data.identified ?? (crop !== 'Unknown'));
          return {
            crop_name: crop,
            cropName: crop,
            confidence: typeof data.confidence === 'number' ? data.confidence : (isPlant ? 90 : 0),
            identified: isPlant,
            is_certain: data.is_certain ?? (data.confidence > 80),
            isCertain: data.isCertain ?? (data.confidence > 80),
            is_plant: isPlant,
            isRecognized: isPlant,
            reason: data.reason || (isPlant ? 'recognized' : 'unidentified'),
          };
        }
      }
    } catch {
      // Fallback
    }

    // 2. If Supabase Edge Function is configured, call it
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.functions.invoke('detect-crop', {
          body: { image: imageDataUrl, language },
        });

        if (!error && data && data.crop_name) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase edge detect-crop failed, falling back:', err);
      }
    }

    // 3. Fallback to Gemini Vision API if key configured directly in app settings
    const apiKey = getGeminiApiKey();
    if (apiKey) {
      try {
        const visionResult = await this.callGeminiVisionAPI('auto', imageDataUrl, language, signal);
        if (visionResult && visionResult.cropName) {
          const matched = matchCropFromInput(visionResult.cropName);
          const isPlantDetected = visionResult.cropName.toLowerCase() !== 'unknown';
          return {
            crop_name: matched ? matched.name : visionResult.cropName,
            cropName: matched ? matched.name : visionResult.cropName,
            confidence: visionResult.confidence || 0,
            identified: isPlantDetected,
            is_certain: visionResult.confidence > 80,
            isCertain: visionResult.confidence > 80,
            is_plant: isPlantDetected,
            isRecognized: isPlantDetected,
            reason: isPlantDetected ? 'unclear' : 'non_plant',
          };
        }
      } catch (err) {
        console.warn('Direct Gemini crop detection error:', err);
      }
    }

    // 4. Return Unknown if no backend or AI key is available
    return {
      crop_name: 'Unknown',
      cropName: 'Unknown',
      confidence: 0,
      identified: false,
      is_certain: false,
      isCertain: false,
      is_plant: false,
      isRecognized: false,
      reason: 'unidentified',
    };
  },

  async analyzeCropDisease(
    cropNameInput: string,
    imageDataUrl: string,
    language: LanguageCode,
    signal?: AbortSignal,
    onProgress?: DiagnosticProgressCallback
  ): Promise<AnalysisResult> {
    const cleanCropInput = cropNameInput ? cropNameInput.trim() : '';

    onProgress?.('analyzer.scanningMessage1', 25);

    // 1. Call Express Backend Server API at VITE_API_URL/api/analyze-crop
    try {
      onProgress?.('analyzer.scanningMessage2', 50);
      const backendRes = await fetch(`${EXPRESS_API_URL}/analyze-crop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({
          cropName: cleanCropInput,
          image: imageDataUrl,
          language,
        }),
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        if (data && (data.diseaseName || data.disease)) {
          const formattedResult: AnalysisResult = {
            id: `scan_${Date.now()}`,
            cropName: data.cropName || data.crop || cleanCropInput || 'Unknown',
            diseaseName: data.diseaseName || data.disease || 'Unable to determine',
            scientificName: data.scientificName || '',
            confidence: typeof data.confidence === 'number' ? data.confidence : 0,
            severity: data.severity || 'Medium',
            symptoms: Array.isArray(data.symptoms) ? data.symptoms : [data.symptoms || 'Symptoms on leaf.'],
            possibleCauses: Array.isArray(data.causes) ? data.causes : [data.causes || 'Environmental factors.'],
            recommendedCare: {
              organic: Array.isArray(data.organic) ? data.organic : ['Bio-fungicide spray'],
              chemical: Array.isArray(data.chemical) ? data.chemical : ['Copper Oxychloride spray'],
              immediateAction: data.immediateAction || data.recommendation || 'Isolate infected foliage.',
            },
            prevention: Array.isArray(data.prevention) ? data.prevention : ['Clean crop cultivation and drip irrigation.'],
            imageUrl: imageDataUrl,
            createdAt: new Date().toISOString(),
          };

          onProgress?.('analyzer.scanningMessage3', 95);
          return formattedResult;
        }
      }
    } catch (e) {
      console.warn('Backend REST API analyze-crop failed, trying fallbacks:', e);
    }

    // 2. Supabase Edge Function fallback
    if (isSupabaseConfigured && supabase) {
      try {
        onProgress?.('analyzer.scanningMessage2', 65);
        const { data, error } = await supabase.functions.invoke('analyze-crop', {
          body: { cropName: cleanCropInput, image: imageDataUrl, language },
        });

        if (!error && data && data.diseaseName) {
          onProgress?.('analyzer.scanningMessage3', 95);
          return data;
        }
      } catch (err) {
        console.warn('Supabase edge function call failed, falling back:', err);
      }
    }

    // 3. Call Gemini Vision API directly if key is configured
    const apiKey = getGeminiApiKey();
    if (apiKey) {
      try {
        onProgress?.('analyzer.scanningMessage2', 75);
        const result = await this.callGeminiVisionAPI(cleanCropInput, imageDataUrl, language, signal);
        onProgress?.('analyzer.scanningMessage3', 95);
        return result;
      } catch (err) {
        console.warn('Direct Gemini call failed, falling back to local database:', err);
      }
    }

    // 4. Return Unknown / 0% confidence if crop cannot be verified from image
    return {
      id: `analysis_unk_${Date.now()}`,
      cropName: 'Unknown',
      diseaseName: 'Unable to determine',
      scientificName: '',
      confidence: 0,
      severity: 'Low',
      symptoms: ['No crop or plant leaf recognized in the uploaded image.'],
      possibleCauses: ['Uploaded image does not appear to be an agricultural crop.'],
      recommendedCare: {
        organic: [],
        chemical: [],
        immediateAction: 'Please upload a clear photograph of an infected plant or crop leaf.',
      },
      prevention: ['Ensure proper crop leaf photography under good lighting.'],
      imageUrl: imageDataUrl,
      createdAt: new Date().toISOString(),
    };
  },

  async callGeminiVisionAPI(
    cropName: string,
    imageDataUrl: string,
    language: LanguageCode,
    signal?: AbortSignal
  ): Promise<AnalysisResult> {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const prompt = `You are an expert Indian Agricultural Agronomist. Analyze this crop leaf image.
Respond ONLY in valid JSON with this exact structure:
{
  "cropName": "Name of crop (e.g., Tomato, Paddy, Cotton, Chilli, Potato, Wheat, Maize)",
  "diseaseName": "Name of disease or 'Healthy Crop' or 'Unable to determine'",
  "scientificName": "Scientific Latin name",
  "confidence": 95,
  "severity": "Low" | "Medium" | "High" | "Healthy",
  "symptoms": ["Symptom 1", "Symptom 2"],
  "possibleCauses": ["Cause 1", "Cause 2"],
  "recommendedCare": {
    "organic": ["Organic remedy 1", "Organic remedy 2"],
    "chemical": ["Chemical spray 1 with dosage", "Chemical spray 2"],
    "immediateAction": "Immediate steps to take"
  },
  "prevention": ["Prevention tip 1", "Prevention tip 2"]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Empty response from Gemini Vision API');
    }

    const jsonString = candidateText.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(jsonString);

    return {
      id: `gemini_${Date.now()}`,
      cropName: parsed.cropName || cropName || 'Unknown',
      diseaseName: parsed.diseaseName || 'Unable to determine',
      scientificName: parsed.scientificName || '',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
      severity: (parsed.severity as SeverityLevel) || 'Medium',
      symptoms: parsed.symptoms || [],
      possibleCauses: parsed.possibleCauses || [],
      recommendedCare: {
        organic: parsed.recommendedCare?.organic || [],
        chemical: parsed.recommendedCare?.chemical || [],
        immediateAction: parsed.recommendedCare?.immediateAction || '',
      },
      prevention: parsed.prevention || [],
      imageUrl: imageDataUrl,
      createdAt: new Date().toISOString(),
    };
  },

  async chatWithAssistant(
    messages: ChatMessage[],
    cropContext?: string,
    language: LanguageCode = 'en'
  ): Promise<string> {
    // 1. Call Express Backend Server API at VITE_API_URL/api/chat
    try {
      const res = await fetch(`${EXPRESS_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, cropContext, language }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) return data.reply;
      }
    } catch {
      // Fallback
    }

    // 2. Direct Gemini Call if configured
    const apiKey = getGeminiApiKey();
    if (apiKey) {
      try {
        const sysPrompt = `You are AI Crop Assistant Doctor for Indian farmers. Crop: ${cropContext || 'General'}. Language: ${language}.`;
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${sysPrompt}\n\nFarmer question: ${messages[messages.length - 1]?.text || 'Help with crops'}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) return replyText;
        }
      } catch (err) {
        console.warn('Direct Gemini chat call failed:', err);
      }
    }

    // 3. Fallback response
    const lastUserText = messages[messages.length - 1]?.text || '';
    if (lastUserText.toLowerCase().includes('fertilizer') || lastUserText.toLowerCase().includes('yellow')) {
      return `For yellow leaves and nutrient boost in ${cropContext || 'your crop'}, apply NPK (19:19:19) at 5g per liter of water, or spray 5% Neem Seed Kernel Extract (NSKE) to control sap-sucking pests.`;
    }

    return `Namaste! As your AI Crop Assistant, I recommend inspecting the leaf underside for pests or mildew. For fungal control, spray Copper Oxychloride 50 WP (2.5g/L) or organic Neem oil. How else can I help your crop today?`;
  },
};
