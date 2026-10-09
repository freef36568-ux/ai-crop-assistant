const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '..', 'src', 'i18n');

const detectionKeys = {
  en: {
    detectingCrop: "Analyzing image and detecting crop...",
    detectedCropLabel: "Detected Crop",
    possibleCropLabel: "Possible Crop",
    unableToDetectCrop: "Unable to detect the crop. Please enter the crop name manually.",
    cropAutoDetectedSuccess: "Auto-detected by AI Vision",
    editCropName: "Edit Crop Name",
    confirmCrop: "Confirm & Diagnose Disease",
    uncertaintyTip: "Please verify or correct the crop name before disease analysis",
    correctedCropNotice: "Custom/Corrected Crop Name"
  },
  te: {
    detectingCrop: "చిత్రాన్ని విశ్లేషిస్తోంది మరియు పంటను గుర్తిస్తోంది...",
    detectedCropLabel: "గుర్తించిన పంట",
    possibleCropLabel: "అంచనా వేసిన పంట",
    unableToDetectCrop: "పంటను గుర్తించడం సాధ్యపడలేదు. దయచేసి పంట పేరును మాన్యువల్‌గా నమోదు చేయండి.",
    cropAutoDetectedSuccess: "AI విజన్ ద్వారా స్వయంచాలకంగా గుర్తించబడింది",
    editCropName: "పంట పేరును సవరించండి",
    confirmCrop: "నిర్ధారించి తెగుళ్లను విశ్లేషించండి",
    uncertaintyTip: "తెగులు విశ్లేషణకు ముందు పంట పేరును ధృవీకరించండి లేదా సవరించండి",
    correctedCropNotice: "సవరించిన పంట పేరు"
  },
  hi: {
    detectingCrop: "छवि का विश्लेषण और फसल की पहचान की जा रही है...",
    detectedCropLabel: "पहचानी गई फसल",
    possibleCropLabel: "संभावित फसल",
    unableToDetectCrop: "फसल की पहचान नहीं हो सकी। कृपया फसल का नाम स्वयं दर्ज करें।",
    cropAutoDetectedSuccess: "AI विज़न द्वारा स्वचालित रूप से पहचानी गई",
    editCropName: "फसल का नाम बदलें",
    confirmCrop: "पुष्टि करें और रोग विश्लेषण करें",
    uncertaintyTip: "रोग विश्लेषण से पहले कृपया फसल के नाम की पुष्टि या सुधार करें",
    correctedCropNotice: "संशोधित फसल का नाम"
  },
  ta: {
    detectingCrop: "படத்தை ஆய்வு செய்து பயிரைக் கண்டறிகிறது...",
    detectedCropLabel: "கண்டறியப்பட்ட பயிர்",
    possibleCropLabel: "சாத்தியமான பயிர்",
    unableToDetectCrop: "பயிரைக் கண்டறிய முடியவில்லை. பயிரின் பெயரை கைமுறையாக உள்ளிடவும்.",
    cropAutoDetectedSuccess: "AI விஷன் மூலம் தானாகக் கண்டறியப்பட்டது",
    editCropName: "பயிர் பெயரைத் திருத்து",
    confirmCrop: "உறுதிசெய்து நோய் பகுப்பாய்வு செய்க",
    uncertaintyTip: "நோய் பகுப்பாய்வுக்கு முன் பயிர் பெயரைச் சரிபார்க்கவும்",
    correctedCropNotice: "திருத்தப்பட்ட பயிர் பெயர்"
  }
};

const allFiles = fs.readdirSync(i18nDir).filter(f => f.endsWith('.json'));

allFiles.forEach(file => {
  const lang = file.replace('.json', '');
  const filePath = path.join(i18nDir, file);
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!data.analyzer) data.analyzer = {};

  const langKeys = detectionKeys[lang] || detectionKeys['en'];
  for (const k in detectionKeys.en) {
    data.analyzer[k] = langKeys[k] || detectionKeys.en[k];
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Added detection keys to ${file}`);
});
console.log('All detection translations written successfully.');
