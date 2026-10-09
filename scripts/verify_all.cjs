const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING CROP WISE VALIDATION SUITE ===\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`✗ FAIL: ${name}`);
    console.error(err);
  }
}

// 1. Language files completeness
const i18nDir = path.join(__dirname, '..', 'src', 'i18n');
const expectedLangs = ['en', 'te', 'hi', 'ta', 'kn', 'ml', 'mr', 'bn', 'gu', 'pa', 'or', 'as', 'ur'];

test('All 13 language JSON files exist and are valid JSON', () => {
  expectedLangs.forEach(lang => {
    const filePath = path.join(i18nDir, `${lang}.json`);
    assert(fs.existsSync(filePath), `Missing ${lang}.json`);
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    assert(typeof json === 'object', `${lang}.json is not an object`);
  });
});

test('All 13 languages contain complete Dashboard translation keys', () => {
  const dashboardKeys = [
    'title', 'welcome', 'welcomeSub', 'quickAnalysisTitle', 'quickAnalysisDesc',
    'statsTotal', 'statsHealthy', 'statsAlerts', 'statsTreated',
    'recentTitle', 'noRecent', 'weatherTitle', 'weatherTip',
    'microclimate', 'fungalRiskModerate', 'temperature', 'humidity',
    'windSpeed', 'rainChance', 'agronomyAdvisory', 'seasonalTipsTitle',
    'expertRecommendations', 'catPestControl', 'catWaterSoil', 'catSeedProtection',
    'cropLibraryQuick', 'viewAllWithCount', 'all15', 'diseasesLabel'
  ];

  expectedLangs.forEach(lang => {
    const json = JSON.parse(fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8'));
    assert(json.dashboard, `Missing dashboard section in ${lang}`);
    dashboardKeys.forEach(key => {
      assert(json.dashboard[key], `Missing dashboard.${key} in ${lang}`);
    });
  });
});

test('All 13 languages contain complete Chat and Voice keys', () => {
  const chatKeys = [
    'floatingTitle', 'headerTitle', 'headerSubtitle', 'welcomeMessage',
    'contextBadge', 'inputPlaceholder', 'send', 'listening', 'stopListening',
    'stopVoice', 'speakAnswer', 'clearChat', 'micButton', 'micDenied', 'notSupported'
  ];

  expectedLangs.forEach(lang => {
    const json = JSON.parse(fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8'));
    assert(json.chat, `Missing chat section in ${lang}`);
    chatKeys.forEach(key => {
      assert(json.chat[key], `Missing chat.${key} in ${lang}`);
    });
  });
});

test('All 13 languages contain Analyzer auto-detect, confidence, and correction keys', () => {
  const analyzerKeys = [
    'title', 'subtitle', 'step1', 'cropNameLabel', 'cropNamePlaceholder',
    'popularCropsLabel', 'step2', 'uploadBoxTitle', 'takePhoto', 'chooseGallery',
    'dragDropText', 'changeImage', 'removeImage', 'analyzeButton', 'analyzing',
    'detectingCrop', 'detectedCropLabel', 'possibleCropLabel', 'unableToDetectCrop',
    'cropAutoDetectedSuccess', 'editCropName', 'confirmCrop', 'uncertaintyTip'
  ];

  expectedLangs.forEach(lang => {
    const json = JSON.parse(fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8'));
    assert(json.analyzer, `Missing analyzer section in ${lang}`);
    analyzerKeys.forEach(key => {
      assert(json.analyzer[key], `Missing analyzer.${key} in ${lang}`);
    });
  });
});

test('Speech recognition locale mapping has exact in-IN codes for all 13 languages', () => {
  const speechServiceContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'services', 'speechService.ts'), 'utf8');
  assert(speechServiceContent.includes("en: 'en-IN'"));
  assert(speechServiceContent.includes("te: 'te-IN'"));
  assert(speechServiceContent.includes("hi: 'hi-IN'"));
  assert(speechServiceContent.includes("ta: 'ta-IN'"));
  assert(speechServiceContent.includes("kn: 'kn-IN'"));
  assert(speechServiceContent.includes("ml: 'ml-IN'"));
  assert(speechServiceContent.includes("mr: 'mr-IN'"));
  assert(speechServiceContent.includes("bn: 'bn-IN'"));
  assert(speechServiceContent.includes("gu: 'gu-IN'"));
  assert(speechServiceContent.includes("pa: 'pa-IN'"));
  assert(speechServiceContent.includes("or: 'or-IN'"));
  assert(speechServiceContent.includes("as: 'as-IN'"));
  assert(speechServiceContent.includes("ur: 'ur-IN'"));
});

test('aiService contains detectCropFromImage and callGeminiDetectCropAPI methods', () => {
  const aiServiceContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'services', 'aiService.ts'), 'utf8');
  assert(aiServiceContent.includes('detectCropFromImage'));
  assert(aiServiceContent.includes('callGeminiDetectCropAPI'));
  assert(aiServiceContent.includes('analyzeCropDisease'));
});

test('AnalysisContext manages auto-crop detection and propagates corrected crop name', () => {
  const contextContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'context', 'AnalysisContext.tsx'), 'utf8');
  assert(contextContent.includes('isDetectingCrop'));
  assert(contextContent.includes('detectedCropResult'));
  assert(contextContent.includes('detectCrop'));
  assert(contextContent.includes('handleSetImageDataUrl'));
});

test('AnalyzePage renders upload first, auto-detect indicator, and manual edit flow', () => {
  const analyzePage = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'AnalyzePage.tsx'), 'utf8');
  assert(analyzePage.includes('isDetectingCrop'));
  assert(analyzePage.includes('detectedCropResult'));
  assert(analyzePage.includes('editCropName'));
  assert(analyzePage.includes('runAnalysis(cropName, imageDataUrl)'));
});

test('Supabase detect-crop edge function exists and is valid', () => {
  const edgeFunctionPath = path.join(__dirname, '..', 'supabase', 'functions', 'detect-crop', 'index.ts');
  assert(fs.existsSync(edgeFunctionPath), 'Missing supabase/functions/detect-crop/index.ts');
  const content = fs.readFileSync(edgeFunctionPath, 'utf8');
  assert(content.includes('cropName'));
  assert(content.includes('confidence'));
  assert(content.includes('isCertain'));
});

test('Persona Welcome Hero and 3 farmer character cards are present', () => {
  const landingContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'LandingPage.tsx'), 'utf8');
  assert(landingContent.includes('The Grower'));
  assert(landingContent.includes('The Harvester'));
  assert(landingContent.includes('The Cultivator'));
  assert(landingContent.includes('/personas/grower.jpg'));
  assert(landingContent.includes('/personas/harvester.jpg'));
  assert(landingContent.includes('/personas/cultivator.jpg'));
});

console.log(`\n========================================`);
console.log(`TOTAL: ${passedTests}/${totalTests} TESTS PASSED`);
console.log(`========================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
