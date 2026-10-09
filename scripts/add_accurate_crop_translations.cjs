const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '..', 'src', 'i18n');

const cropKeys = {
  en: {
    nonPlantError: "No recognizable crop detected. Please upload a clear crop/plant image.",
    cropUnidentifiedError: "Crop could not be identified accurately. Please enter the crop name manually.",
    confidenceHigh: "Confidence: High",
    confidenceLow: "Confidence: Low"
  },
  te: {
    nonPlantError: "గుర్తించదగిన పంట ఏదీ కనిపించలేదు. దయచేసి స్పష్టమైన పంట/మొక్క చిత్రాన్ని అప్‌లోడ్ చేయండి.",
    cropUnidentifiedError: "పంటను కచ్చితంగా గుర్తించడం సాధ్యపడలేదు. దయచేసి పంట పేరును మాన్యువల్‌గా నమోదు చేయండి.",
    confidenceHigh: "ఖచ్చితత్వం: ఎక్కువ (High)",
    confidenceLow: "ఖచ్చితత్వం: తక్కువ (Low)"
  },
  hi: {
    nonPlantError: "कोई पहचानने योग्य फसल नहीं मिली। कृपया एक स्पष्ट फसल/पौधे की छवि अपलोड करें।",
    cropUnidentifiedError: "फसल की सटीक पहचान नहीं हो सकी। कृपया फसल का नाम स्वयं दर्ज करें।",
    confidenceHigh: "विश्वसनीयता: उच्च (High)",
    confidenceLow: "विश्वसनीयता: कम (Low)"
  },
  ta: {
    nonPlantError: "அடையாளம் காணக்கூடிய பயிர் எதுவும் கண்டறியப்படவில்லை. தெளிவான பயிர்/செடி படத்தை பதிவேற்றவும்.",
    cropUnidentifiedError: "பயிரைத் துல்லியமாகக் கண்டறிய முடியவில்லை. பயிரின் பெயரை கைமுறையாக உள்ளிடவும்.",
    confidenceHigh: "நம்பகத்தன்மை: அதிகம் (High)",
    confidenceLow: "நம்பகத்தன்மை: குறைவு (Low)"
  }
};

const allFiles = fs.readdirSync(i18nDir).filter(f => f.endsWith('.json'));

allFiles.forEach(file => {
  const lang = file.replace('.json', '');
  const filePath = path.join(i18nDir, file);
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!data.analyzer) data.analyzer = {};

  const langKeys = cropKeys[lang] || cropKeys['en'];
  for (const k in cropKeys.en) {
    data.analyzer[k] = langKeys[k] || cropKeys.en[k];
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated translations in ${file}`);
});
console.log('All accurate crop translations written successfully.');
