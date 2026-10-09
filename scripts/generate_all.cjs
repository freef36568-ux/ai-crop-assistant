const fs = require('fs');
const path = require('path');

const en = require('./data_en.cjs');
const te = require('./data_te.cjs');
const hi = require('./data_hi.cjs');

const meta = {
  ta: { name: 'தமிழ்', brand: 'கிராப் வைஸ் (Crop Wise)', doctor: 'AI பயிர் மருத்துவர்', diagnose: 'பயிர் பரிசோதனை', lib: 'பயிர்கள் விவரம்', hist: 'பழைய வரலாறு', set: 'அமைப்புகள்', chat: 'AI மருத்துவர் சாட்' },
  kn: { name: 'ಕನ್ನಡ', brand: 'ಕ್ರಾಪ್ ವೈಸ್ (Crop Wise)', doctor: 'AI ಬೆಳೆ ವೈದ್ಯ', diagnose: 'ಬೆಳೆ ಪರೀಕ್ಷೆ', lib: 'ಬೆಳೆಗಳ ಮಾಹಿತಿ', hist: 'ಹಿಂದಿನ ಇತಿಹಾಸ', set: 'ಸೆಟ್ಟಿಂಗ್ಸ್', chat: 'AI ವೈದ್ಯರ ಚಾಟ್' },
  ml: { name: 'മലയാളം', brand: 'ക്രോപ്പ് വൈസ് (Crop Wise)', doctor: 'AI വിള ഡോക്ടർ', diagnose: 'വിള പരിശോധന', lib: 'വിള വിവരങ്ങൾ', hist: 'ചരിത്രം', set: 'ക്രമീകരണങ്ങൾ', chat: 'AI ഡോക്ടർ ചാറ്റ്' },
  mr: { name: 'मराठी', brand: 'क्रॉप वाईज (Crop Wise)', doctor: 'AI पीक डॉक्टर', diagnose: 'पीक तपासणी', lib: 'पीक माहिती', hist: 'मागील नोंदी', set: 'सेटिंग्ज', chat: 'AI डॉक्टर चॅट' },
  bn: { name: 'বাংলা', brand: 'ক্রপ ওয়াইজ (Crop Wise)', doctor: 'AI ফসল ডাক্তার', diagnose: 'ফসল পরীক্ষা', lib: 'ফসল গ্রন্থাগার', hist: 'পূর্ববর্তী ইতিহাস', set: 'সেটিংস', chat: 'AI ডাক্তার চ্যাট' },
  gu: { name: 'ગુજરાતી', brand: 'ક્રોપ વાઈઝ (Crop Wise)', doctor: 'AI પાક ડૉક્ટર', diagnose: 'પાક તપાસ', lib: 'પાક માહિતી', hist: 'પાછલો ઇતિહાસ', set: 'સેટિંગ્સ', chat: 'AI ડૉક્ટર ચેટ' },
  pa: { name: 'ਪੰਜਾਬੀ', brand: 'ਕਰੌਪ ਵਾਈਜ਼ (Crop Wise)', doctor: 'AI ਫ਼ਸਲ ਡਾਕਟਰ', diagnose: 'ਫ਼ਸਲ ਜਾਂਚ', lib: 'ਫ਼ਸਲ ਜਾਣਕਾਰੀ', hist: 'ਪਿਛਲਾ ਇਤਿਹਾਸ', set: 'ਸੈਟਿੰਗਾਂ', chat: 'AI ਡਾਕਟਰ ਚੈਟ' },
  or: { name: 'ଓଡ଼ିଆ', brand: 'କ୍ରପ୍ ୱାଇଜ୍ (Crop Wise)', doctor: 'AI ଫସଲ ଡାକ୍ତର', diagnose: 'ଫସଲ ପରୀକ୍ଷା', lib: 'ଫସଲ ତଥ୍ୟ', hist: 'ପୂର୍ବ ଇତିହାସ', set: 'ସେଟିଙ୍ଗ୍ସ', chat: 'AI ଡାକ୍ତର ଚାଟ୍' },
  as: { name: 'অসমীয়া', brand: 'ক্ৰপ ৱাইজ (Crop Wise)', doctor: 'AI শস্য ডাক্তৰ', diagnose: 'শস্য পৰীক্ষা', lib: 'শস্য পুথিভঁৰাল', hist: 'পূৰ্বৰ ইতিহাস', set: 'ছেটিংছ', chat: 'AI ডাক্তৰ চাট' },
  ur: { name: 'اردو', brand: 'کراپ وائز (Crop Wise)', doctor: 'AI فصل ڈاکٹر', diagnose: 'فصل کی جانچ', lib: 'فصلوں کی معلومات', hist: 'تاریخچہ', set: 'ترتیبات', chat: 'AI ڈاکٹر چیٹ' }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const outDir = path.join(__dirname, '..', 'src', 'i18n');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'en.json'), JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'te.json'), JSON.stringify(te, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'hi.json'), JSON.stringify(hi, null, 2), 'utf8');

Object.keys(meta).forEach(code => {
  const m = meta[code];
  const langObj = deepClone(hi);
  langObj.brand.name = m.brand;
  langObj.brand.taglineShort = m.doctor;
  langObj.nav.analyze = m.diagnose;
  langObj.nav.library = m.lib;
  langObj.nav.history = m.hist;
  langObj.nav.settings = m.set;
  langObj.nav.help = m.chat;
  langObj.chat.floatingTitle = m.doctor;
  langObj.chat.headerTitle = m.brand + ' ' + m.doctor;
  
  fs.writeFileSync(path.join(outDir, code + '.json'), JSON.stringify(langObj, null, 2), 'utf8');
  console.log('Generated ' + code + '.json');
});

console.log('All 13 i18n JSON translation files written successfully.');
