# 🌱 AI Crop Assistant

> Fast, Simple, and Farmer-Friendly AI Crop Assistant tailored for Indian Farmers across 13 Languages.

---

## 🌟 Key Features

- **🌐 13 Indian Languages (100% Full Translation):**
  - English (`en`), Telugu (`te`), Hindi (`hi`), Tamil (`ta`), Kannada (`kn`), Malayalam (`ml`), Marathi (`mr`), Bengali (`bn`), Gujarati (`gu`), Punjabi (`pa`), Odia (`or`), Assamese (`as`), and Urdu (`ur`).
  - Translates every module: Landing Page, Dashboard, Analyzer, Crop Library, History, AI Assistant, and PDF reports.
- **🎤 Two-Way Crop Name Input:**
  - Manual typing in native Indic scripts (e.g. `టమాటా`, `धान`, `கோதுமை`) and English.
  - Speech Recognition: 🎤 Speak crop name with automatic locale mapping (`te-IN`, `hi-IN`, `ta-IN`, etc.).
- **📸 Fast Image Upload & Compression:**
  - Mobile camera capture (`capture="environment"`), file gallery picker, and drag & drop.
  - Client-side Canvas image optimization to reduce bandwidth in remote village fields.
- **⚡ AI Disease Vision Diagnosis:**
  - Structured pathology reports: Crop, Disease, Scientific Name, Confidence %, Severity Badge, Observed Symptoms, Possible Causes, Organic Remedies (Neem sprays/Panchagavya), Chemical Sprays with exact dosages per liter, and Field Prevention.
  - **Read Aloud (Voice)**: Farmers can listen to diagnostic reports read out loud in their native tongue.
  - **Download PDF Report**: Instant printable official agricultural diagnostic report.
- **💬 24/7 AI Crop Doctor (Floating Assistant):**
  - Slide-out drawer with chat history, session context retention, voice input, quick prompt pills, and audio narration.
- **📚 15 Indian Crops Knowledge Base:**
  - Rice, Wheat, Cotton, Tomato, Chilli, Maize, Groundnut, Sugarcane, Potato, Onion, Mango, Banana, Coconut, Turmeric, and Soybean.
  - Detailed optimal season, temperature, soil type, water requirement, duration, and 40+ disease management guides.
- **☁️ Supabase Cloud & Offline Sync:**
  - Cloud database sync with Row Level Security (RLS).
  - Works 100% offline out of the box with realistic agronomic intelligence in Demo Mode.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env` if connecting to live Supabase and Gemini APIs:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```text
src/
  ├── components/
  │     ├── common/      # Navbar, Footer, LanguageSelector, VoiceButton, DemoBanner, LoadingSkeleton
  │     ├── analyzer/    # CropInput, ImageUploader, AnalysisResultCard, ReportModal
  │     ├── chat/        # FloatingChatButton, AssistantDrawer
  │     ├── dashboard/   # WeatherAlertCard, StatsOverview, RecentAnalysesWidget, SeasonalTips
  │     ├── library/     # CropCard, CropDetailModal
  │     └── history/     # HistoryCard
  ├── context/           # LanguageContext, AnalysisContext, AuthContext
  ├── i18n/              # 13 Complete Indian Language JSON Translation files
  ├── lib/               # Supabase client and connection health check
  ├── pages/             # LandingPage, DashboardPage, AnalyzePage, CropLibraryPage, HistoryPage, SettingsPage
  ├── services/          # aiService, cropDatabase (15 crops), speechService, storageService, pdfService
  ├── types/             # TypeScript type definitions
  └── utils/             # imageCompression, dateUtils, cn
supabase/
  ├── schema.sql         # PostgreSQL schema with RLS and triggers
  └── functions/         # Edge functions for AI vision and chat
```

---

## 📜 License
MIT – Built with ❤️ for the farming community of India.
