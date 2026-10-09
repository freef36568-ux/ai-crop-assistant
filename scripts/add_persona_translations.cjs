const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '..', 'src', 'i18n');

const personaKeys = {
  en: {
    personaBadge: "AI CROP ASSISTANT",
    personaTitleWelcome: "Welcome to",
    personaTitleHighlight: "AI Crop",
    personaTitleAssistant: "Assistant",
    personaSubtitle: "Smart farming assistance for better crops and better decisions.",
    personaGrowerTitle: "The Grower",
    personaGrowerDesc: "Confident in every season",
    personaHarvesterTitle: "The Harvester",
    personaHarvesterDesc: "Hands-on with healthy crops",
    personaCultivatorTitle: "The Cultivator",
    personaCultivatorDesc: "Equipped for the field",
  },
  te: {
    personaBadge: "AI పంటల సహాయకుడు",
    personaTitleWelcome: "స్వాగతం",
    personaTitleHighlight: "AI క్రాప్",
    personaTitleAssistant: "అసిస్టెంట్",
    personaSubtitle: "మంచి దిగుబడి మరియు సరైన నిర్ణయాల కోసం స్మార్ట్ వ్యవసాయ సహాయం.",
    personaGrowerTitle: "ది గ్రోయర్ (సాగుదారుడు)",
    personaGrowerDesc: "ప్రతి కాలంలోనూ ఆత్మవిశ్వాసంతో",
    personaHarvesterTitle: "ది హార్వెస్టర్ (కోతదారుడు)",
    personaHarvesterDesc: "ఆరోగ్యకరమైన పంటల సంరక్షణ",
    personaCultivatorTitle: "ది కల్టివేటర్ (రైతు మిత్రుడు)",
    personaCultivatorDesc: "పొలానికి సంసిద్ధంగా",
  },
  hi: {
    personaBadge: "AI फसल सहायक",
    personaTitleWelcome: "स्वागत है",
    personaTitleHighlight: "AI क्रॉप",
    personaTitleAssistant: "असिस्टेंट",
    personaSubtitle: "बेहतर फसल और सही फैसलों के लिए स्मार्ट कृषि सहायता।",
    personaGrowerTitle: "द ग्रोवर (उत्पादक)",
    personaGrowerDesc: "हर मौसम में आत्मविश्वास के साथ",
    personaHarvesterTitle: "द हार्वेस्टर (कटाई विशेषज्ञ)",
    personaHarvesterDesc: "स्वस्थ फसलों की बेहतर देखभाल",
    personaCultivatorTitle: "द कल्टीवेटर (किसान साथी)",
    personaCultivatorDesc: "खेत के लिए हमेशा तैयार",
  },
  ta: {
    personaBadge: "AI பயிர் உதவியாளர்",
    personaTitleWelcome: "நல்வரவு",
    personaTitleHighlight: "AI கிராப்",
    personaTitleAssistant: "அசிஸ்டென்ட்",
    personaSubtitle: "சிறந்த பயிர்கள் மற்றும் சிறந்த முடிவுகளுக்கான ஸ்மார்ட் விவசாய உதவி.",
    personaGrowerTitle: "வளர்ப்பவர்",
    personaGrowerDesc: "ஒவ்வொரு பருவத்திலும் நம்பிக்கையுடன்",
    personaHarvesterTitle: "அறுவடையாளர்",
    personaHarvesterDesc: "ஆரோக்கியமான பயிர்களுடன்",
    personaCultivatorTitle: "விவசாயி",
    personaCultivatorDesc: "களத்திற்கு தயாராக",
  }
};

const allFiles = fs.readdirSync(i18nDir).filter(f => f.endsWith('.json'));

allFiles.forEach(file => {
  const lang = file.replace('.json', '');
  const filePath = path.join(i18nDir, file);
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!data.landing) data.landing = {};

  const langKeys = personaKeys[lang] || personaKeys['en'];
  for (const k in personaKeys.en) {
    data.landing[k] = langKeys[k] || personaKeys.en[k];
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Added persona keys to ${file}`);
});
console.log('Persona translations successfully written.');
