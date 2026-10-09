export type LanguageCode =
  | 'en' // English
  | 'te' // Telugu
  | 'hi' // Hindi
  | 'ta' // Tamil
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'mr' // Marathi
  | 'bn' // Bengali
  | 'gu' // Gujarati
  | 'pa' // Punjabi
  | 'or' // Odia
  | 'as' // Assamese
  | 'ur'; // Urdu

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  speechCode: string;
  flag: string;
}

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Healthy';

export interface TreatmentPlan {
  organic: string[];
  chemical: string[];
  immediateAction: string;
}

export interface AnalysisResult {
  id: string;
  cropName: string;
  diseaseName: string;
  scientificName?: string;
  confidence: number;
  severity: SeverityLevel;
  symptoms: string[];
  possibleCauses: string[];
  recommendedCare: TreatmentPlan;
  prevention: string[];
  imageUrl: string;
  createdAt: string;
  userId?: string;
  notes?: string;
  isDemo?: boolean;
}

export interface CropDisease {
  id: string;
  name: string;
  scientificName: string;
  severity: SeverityLevel;
  symptoms: string[];
  causes: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  prevention: string[];
  imagePlaceholder?: string;
}

export interface CropInfo {
  id: string;
  name: string;
  localNames: Record<LanguageCode, string>;
  scientificName: string;
  category: 'Cereals' | 'Cash Crops' | 'Vegetables' | 'Fruits' | 'Spices' | 'Pulses';
  season: string;
  optimalTemperature: string;
  soilType: string;
  waterRequirement: 'Low' | 'Medium' | 'High';
  durationDays: string;
  commonDiseases: CropDisease[];
  growthTips: string[];
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioAvailable?: boolean;
  cropContext?: string;
}

export interface WeatherAdvisory {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  riskAlert: string;
  favorableDiseases: string[];
}

export interface UserProfile {
  id: string;
  email?: string;
  fullName: string;
  preferredLanguage: LanguageCode;
  farmLocation?: string;
  farmSizeAcres?: number;
  isGuest: boolean;
}

export interface CropDetectionResult {
  crop_name: string;
  cropName: string;
  confidence: number;
  identified: boolean;
  is_certain: boolean;
  isCertain: boolean;
  is_plant: boolean;
  isRecognized: boolean;
  message?: string;
  reason?: 'unidentified' | 'non_plant' | 'unclear' | 'api_error';
}


