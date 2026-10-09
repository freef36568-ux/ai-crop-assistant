const fs = require('fs');
const path = require('path');

const crops = [
  {
    id: "rice",
    name: "Rice (Paddy)",
    localNames: {
      en: "Rice (Paddy)", te: "వరి (Paddy)", hi: "धान (चावल)", ta: "நெல்", kn: "ಭತ್ತ",
      ml: "നെല്ല്", mr: "भात / धान", bn: "ধান", gu: "ડાંગર / ચોખા", pa: "ਝੋਨਾ", or: "ଧାନ", as: "ধান", ur: "دھان / چاول"
    },
    scientificName: "Oryza sativa",
    category: "Cereals",
    season: "Kharif (June-Nov) / Rabi (Nov-April)",
    optimalTemperature: "22°C - 32°C",
    soilType: "Clayey loam, alluvial soil with good water retention",
    waterRequirement: "High",
    durationDays: "110 - 150 days",
    imageUrl: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "Maintain 2-5 cm standing water during tillering to panicle initiation.",
      "Apply neem-coated urea in split doses (basal, tillering, panicle initiation).",
      "Use certified seeds treated with Carbendazim (2g/kg seed)."
    ],
    commonDiseases: [
      {
        id: "rice-blast",
        name: "Rice Blast",
        scientificName: "Magnaporthe oryzae",
        severity: "High",
        symptoms: ["Spindle-shaped spots with grey-white center and brown margin on leaves", "Dark brown lesions at node and neck of panicle", "Premature lodging and empty grains"],
        causes: ["High humidity (>90%)", "Excessive nitrogen fertilizer application", "Frequent cloudy days with intermittent rains"],
        organicTreatment: ["Spray Pseudomonas fluorescens @ 2.5 kg/ha in 500L water", "Apply 5% Neem Seed Kernel Extract (NSKE) spray", "Avoid stagnant flood water during high humidity"],
        chemicalTreatment: ["Tricyclazole 75% WP @ 0.6 g/L water at first sign of leaf spots", "Isoprothiolane 40% EC @ 1.5 mL/L water", "Azoxystrobin 23% SC @ 1 mL/L water"],
        prevention: ["Use resistant varieties like Swarna, IR-64, or MTU-1010", "Avoid excessive nitrogen fertilization", "Treat seeds with Tricyclazole before nursery sowing"]
      },
      {
        id: "bacterial-leaf-blight",
        name: "Bacterial Leaf Blight (BLB)",
        scientificName: "Xanthomonas oryzae pv. oryzae",
        severity: "High",
        symptoms: ["Water-soaked lesions turning yellow-white along leaf margins", "Wavy leaf edges curling inwards", "Milky bacterial ooze visible in early morning droplets"],
        causes: ["Heavy rains and typhoon winds", "Deep standing water in fields", "Excessive unmeasured nitrogen fertilizer"],
        organicTreatment: ["Spray fresh cow dung filtrate (20g/L) + Hing (Asafoetida) spray", "Apply copper-enriched Panchagavya @ 3% dilution", "Drain excess stagnant water for 3 days to aerate roots"],
        chemicalTreatment: ["Copper Hydroxide 77% WP @ 2.0 g/L water", "Streptocycline @ 0.1 g/L water combined with Copper Oxychloride @ 2 g/L water"],
        prevention: ["Avoid clipping seedlings tip at transplanting", "Maintain balanced N-P-K (especially adequate Potassium)", "Adopt alternate wetting and drying (AWD) irrigation"]
      }
    ]
  },
  {
    id: "tomato",
    name: "Tomato",
    localNames: {
      en: "Tomato", te: "టమాటా (Tomato)", hi: "टमाटर", ta: "தக்காளி", kn: "ಟೊಮೆಟೊ",
      ml: "തക്കാളി", mr: "टोमॅटो", bn: "টমেটো", gu: "ટામેટા", pa: "ਟਮਾਟਰ", or: "ଟମାଟୋ", as: "বিলাহী", ur: "ٹماٹر"
    },
    scientificName: "Solanum lycopersicum",
    category: "Vegetables",
    season: "Year round (Rabi, Kharif, Summer)",
    optimalTemperature: "18°C - 27°C",
    soilType: "Well-drained sandy loam rich in organic matter (pH 6.0 - 7.0)",
    waterRequirement: "Medium",
    durationDays: "90 - 130 days",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "Provide sturdy bamboo staking at 30 days after transplanting.",
      "Mulch with straw or black plastic to prevent soil-borne splash infections.",
      "Drip irrigation at root level is superior to overhead sprinkler watering."
    ],
    commonDiseases: [
      {
        id: "tomato-early-blight",
        name: "Early Blight",
        scientificName: "Alternaria solani",
        severity: "Medium",
        symptoms: ["Concentric dark brown rings on older lower leaves (target board pattern)", "Yellowing halo surrounding the brown rings", "Stem lesions at soil line (collar rot)"],
        causes: ["Warm temperatures (24-29°C) accompanied by heavy dew or rains", "Plant stress and potassium deficiency"],
        organicTreatment: ["Spray 10% Cow urine + 5% Neem leaf extract spray every 7 days", "Apply Bacillus subtilis @ 5g/L water", "Prune and destroy infected lower leaves immediately"],
        chemicalTreatment: ["Mancozeb 75% WP @ 2.5 g/L water", "Chlorothalonil 75% WP @ 2 g/L water", "Difenoconazole 25% EC @ 0.5 mL/L water"],
        prevention: ["Practice crop rotation with non-solanaceous crops for 3 years", "Avoid overhead wetting of foliage", "Stake plants upright to keep leaves away from soil"]
      },
      {
        id: "tomato-leaf-curl",
        name: "Tomato Leaf Curl Virus (ToLCV)",
        scientificName: "Begomovirus transmitted by Whitefly",
        severity: "High",
        symptoms: ["Severe upward and downward curling and puckering of leaves", "Stunted bushy plant growth with short internodes", "Flower shedding and failure to set fruits"],
        causes: ["Whitefly insect population explosion in dry, warm weather"],
        organicTreatment: ["Install yellow sticky traps @ 20-25 traps/acre to trap whiteflies", "Spray 5% Neem seed kernel extract (NSKE) or 10,000 ppm Azadirachtin @ 2 mL/L", "Intercrop with barrier crops like maize or sorghum on field borders"],
        chemicalTreatment: ["Diafenthiuron 50% WP @ 1.2 g/L water", "Thiamethoxam 25% WG @ 0.4 g/L water", "Acetamiprid 20% SP @ 0.5 g/L water"],
        prevention: ["Use silver reflective mulching sheets", "Protect seedlings in nursery with 40-mesh insect-proof nylon nets", "Uproot and bury severely infected viral plants"]
      }
    ]
  },
  {
    id: "cotton",
    name: "Cotton",
    localNames: {
      en: "Cotton", te: "ప్రత్తి (Cotton)", hi: "कपास", ta: "பருத்தி", kn: "ಹತ್ತಿ",
      ml: "പരുത്തി", mr: "कापूस", bn: "তুলা", gu: "કપાસ", pa: "ਕਪਾਹ", or: "କପା", as: "কপাহ", ur: "کپاس"
    },
    scientificName: "Gossypium hirsutum",
    category: "Cash Crops",
    season: "Kharif (May - November)",
    optimalTemperature: "21°C - 35°C",
    soilType: "Deep black cotton soil (Regur), alluvial well-drained loam",
    waterRequirement: "Medium",
    durationDays: "150 - 180 days",
    imageUrl: "https://images.unsplash.com/photo-1594488518065-819777df509c?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "Do not apply excess nitrogen after flowering to avoid boll rot and excessive vegetative growth.",
      "Install pheromone traps @ 5 per acre to monitor Pink Bollworm moths.",
      "Nipping/topping of terminal shoots at 90 days boosts boll development."
    ],
    commonDiseases: [
      {
        id: "cotton-bollworm",
        name: "Pink Bollworm & American Bollworm",
        scientificName: "Pectinophora gossypiella / Helicoverpa armigera",
        severity: "High",
        symptoms: ["Rosetted flowers with petals twisted together", "Bored holes on bolls with excreta at the entrance", "Stained fiber and premature boll opening (locule rot)"],
        causes: ["Continuous cotton monoculture", "Warm dry weather and lack of timely trap crop management"],
        organicTreatment: ["Install 8 Pheromone traps/acre with Gossyplure lures", "Release Trichogramma bactrae egg parasitoids @ 60,000/acre at weekly intervals", "Spray Beauveria bassiana @ 5g/L water in evening hours"],
        chemicalTreatment: ["Emamectin Benzoate 5% SG @ 0.5 g/L water", "Spinetoram 11.7% SC @ 1 mL/L water", "Chlorantraniliprole 18.5% SC @ 0.3 mL/L water"],
        prevention: ["Strictly terminate crop before January to break pest lifecycle", "Plant non-Bt refuge cotton / castor border rows", "Avoid late-season excessive urea top-dressing"]
      }
    ]
  },
  {
    id: "chilli",
    name: "Chilli",
    localNames: {
      en: "Chilli", te: "మిరప (Chilli)", hi: "हरी / लाल मिर्च", ta: "மிளகாய்", kn: "ಮೆಣಸಿನಕಾಯಿ",
      ml: "മുളക്", mr: "मिरची", bn: "লঙ্কা", gu: "મરચાં", pa: "ਮਿਰਚ", or: "ଲଙ୍କା", as: "জলকীয়া", ur: "مرچ"
    },
    scientificName: "Capsicum annuum",
    category: "Spices",
    season: "Kharif (June-Oct) / Rabi (Sept-Feb)",
    optimalTemperature: "20°C - 30°C",
    soilType: "Well-drained sandy loam or black loam with pH 6.5 - 7.5",
    waterRequirement: "Medium",
    durationDays: "120 - 180 days",
    imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "Avoid waterlogging at all stages; chilli roots rot quickly in waterlogged soil.",
      "Spray Boron 20% @ 1g/L at flowering to prevent blossom drop and boost fruit size.",
      "Use blue sticky traps for Thrips and yellow sticky traps for Whiteflies."
    ],
    commonDiseases: [
      {
        id: "chilli-leaf-curl",
        name: "Chilli Leaf Curl & Murda Disease",
        scientificName: "Scirtothrips dorsalis / Begomovirus",
        severity: "High",
        symptoms: ["Upward curling of leaves (Boat-shape) caused by Thrips", "Downward curling of leaves caused by Mites", "Crinkling, thickening, and brittle leaves with stunted growth"],
        causes: ["Hot dry weather followed by humid spells fostering thrip/mite multiplication"],
        organicTreatment: ["Spray 10,000 ppm Neem oil (Azadirachtin) @ 2 mL/L water", "Apply Wettable Sulfur 80% WDG @ 3 g/L for mites", "Spray garlic-chilli extract @ 5 mL/L water"],
        chemicalTreatment: ["Fipronil 5% SC @ 2 mL/L water for Thrips", "Spiromesifen 22.9% SC @ 1 mL/L water for Mites", "Diafenthiuron 50% WP @ 1.2 g/L"],
        prevention: ["Erect barrier crops like 4 rows of Sorghum around field", "Maintain adequate soil moisture with drip irrigation", "Dip seedling roots in Imidacloprid solution before transplanting"]
      }
    ]
  },
  {
    id: "wheat",
    name: "Wheat",
    localNames: {
      en: "Wheat", te: "గోధుమ (Wheat)", hi: "गेहूं", ta: "கோதுமை", kn: "ಗೋಧಿ",
      ml: "ഗോതമ്പ്", mr: "गहू", bn: "গম", gu: "ઘઉં", pa: "ਕਣਕ", or: "ଗହମ", as: "ঘেঁহু", ur: "گندم"
    },
    scientificName: "Triticum aestivum",
    category: "Cereals",
    season: "Rabi (November - April)",
    optimalTemperature: "15°C - 25°C",
    soilType: "Well-drained fertile clay loam or loam",
    waterRequirement: "Medium",
    durationDays: "110 - 140 days",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "First irrigation at Crown Root Initiation (CRI stage, 21 days after sowing) is most crucial.",
      "Avoid excess water at maturity to prevent lodging.",
      "Ensure balanced N-P-K (120:60:40 kg/ha) with Zinc sulfate (25 kg/ha)."
    ],
    commonDiseases: [
      {
        id: "wheat-yellow-rust",
        name: "Yellow / Stripe Rust",
        scientificName: "Puccinia striiformis",
        severity: "High",
        symptoms: ["Bright yellow stripe-like pustules arranged in linear rows on leaves", "Yellow powdery spores on hands when rubbing leaves", "Premature leaf drying leading to shriveled grain"],
        causes: ["Cool temperatures (10-15°C) with continuous fog or dew in North India"],
        organicTreatment: ["Spray Trichoderma viride @ 5g/L water at first sign", "Dust sulfur powder @ 10 kg/acre in calm morning air"],
        chemicalTreatment: ["Propiconazole 25% EC (Tilt) @ 1 mL/L water", "Tebuconazole 25.9% EC @ 1 mL/L water"],
        prevention: ["Plant rust-resistant varieties (HD-2967, HD-3086, DBW-187, DBW-222)", "Avoid late sowing beyond mid-November"]
      }
    ]
  },
  {
    id: "maize",
    name: "Maize (Corn)",
    localNames: {
      en: "Maize (Corn)", te: "మొక్కజొన్న (Maize)", hi: "मक्का", ta: "மக்காச்சோளம்", kn: "ಜೋಳ / ಮೆಕ್ಕೆಜೋಳ",
      ml: "ചോളം", mr: "मका", bn: "ভুট্টা", gu: "મકાઈ", pa: "ਮੱਕੀ", or: "ମକା", as: "গোমধান", ur: "مکئی"
    },
    scientificName: "Zea mays",
    category: "Cereals",
    season: "Kharif, Rabi and Spring",
    optimalTemperature: "21°C - 30°C",
    soilType: "Deep fertile loam with good organic matter and excellent drainage",
    waterRequirement: "Medium",
    durationDays: "90 - 110 days",
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "Critical irrigation stages are knee-high stage, tasseling, and silking stage.",
      "Fall Armyworm monitoring must begin from 7 days after germination."
    ],
    commonDiseases: [
      {
        id: "fall-armyworm",
        name: "Fall Armyworm (FAW)",
        scientificName: "Spodoptera frugiperda",
        severity: "High",
        symptoms: ["Pin-holes and window pane feeding on young leaves", "Heavy ragged feeding in plant whorl filled with sawdust-like frass", "Larvae with inverted Y mark on head"],
        causes: ["Warm temperatures and continuous maize monoculture"],
        organicTreatment: ["Application of sand/ash mixture (9:1) or neem cake powder into leaf whorls", "Release Telenomus remus egg parasitoid @ 40,000/acre", "Spray Metarhizium anisopliae @ 5g/L water into whorls"],
        chemicalTreatment: ["Chlorantraniliprole 18.5% SC @ 0.4 mL/L into whorl", "Spinetoram 11.7% SC @ 0.5 mL/L water", "Emamectin benzoate 5% SG @ 0.5 g/L water"],
        prevention: ["Synchronized community sowing in the region", "Intercrop with pulses like cowpea", "Install FAW pheromone traps @ 5 per acre"]
      }
    ]
  },
  {
    id: "groundnut",
    name: "Groundnut (Peanut)",
    localNames: {
      en: "Groundnut", te: "వేరుశనగ (Groundnut)", hi: "मूंगफली", ta: "நிலக்கடலை", kn: "ಕಡಲೆಕಾಯಿ",
      ml: "നിലക്കടല", mr: "भुईमूग", bn: "চীনাবাদাম", gu: "મગફળી", pa: "ਮੂੰਗਫਲੀ", or: "ଚିନାବାଦାମ", as: "বাদাম", ur: "مونگ پھلی"
    },
    scientificName: "Arachis hypogaea",
    category: "Pulses",
    season: "Kharif (June-Oct) / Rabi (Nov-March)",
    optimalTemperature: "25°C - 30°C",
    soilType: "Light sandy loam, well-drained red sandy soil with loose texture",
    waterRequirement: "Medium",
    durationDays: "105 - 125 days",
    imageUrl: "https://images.unsplash.com/photo-1567892323490-67c4d5162a87?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "Apply Gypsum @ 200 kg/acre at 40-45 days (pegging stage) for healthy pod filling and shell hardness.",
      "Treat seeds with Rhizobium and Trichoderma cultures before sowing."
    ],
    commonDiseases: [
      {
        id: "groundnut-tikka",
        name: "Tikka Disease (Leaf Spot)",
        scientificName: "Cercospora arachidicola",
        severity: "Medium",
        symptoms: ["Circular reddish-brown with prominent yellow halo", "Dark brown to black spots on underside of leaf", "Severe defoliation leaving stems bare"],
        causes: ["High humidity (>85%) with temperatures around 25-30°C"],
        organicTreatment: ["Spray 3% Panchagavya + 5% NSKE at 15-day intervals", "Soil application of Trichoderma viride enriched FYM"],
        chemicalTreatment: ["Hexaconazole 5% SC @ 2 mL/L water", "Carbendazim 12% + Mancozeb 63% WP @ 1.5 g/L"],
        prevention: ["Crop rotation with non-leguminous crops", "Proper seed treatment with Thiram + Carbendazim (1:1)"]
      }
    ]
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    localNames: {
      en: "Sugarcane", te: "చెరకు (Sugarcane)", hi: "गन्ना", ta: "கரும்பு", kn: "ಕಬ್ಬು",
      ml: "കരിമ്പ്", mr: "ऊस", bn: "আখ", gu: "શેરડી", pa: "ਗੰਨਾ", or: "ଆଖୁ", as: "কুঁহিয়াৰ", ur: "گنا"
    },
    scientificName: "Saccharum officinarum",
    category: "Cash Crops",
    season: "Autumn / Spring / Adsali",
    optimalTemperature: "20°C - 35°C",
    soilType: "Deep rich loam, black soil with good drainage and water table > 1.5m",
    waterRequirement: "High",
    durationDays: "300 - 360 days",
    imageUrl: "https://images.unsplash.com/photo-1589135233689-d49fa211d044?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "Trash mulching between cane rows conserves moisture and suppresses weed growth.",
      "Earthing up at 90 and 120 days prevents lodging during monsoon storms."
    ],
    commonDiseases: [
      {
        id: "sugarcane-red-rot",
        name: "Red Rot of Sugarcane",
        scientificName: "Colletotrichum falcatum",
        severity: "High",
        symptoms: ["Third or fourth leaf from top shows yellowing and withering", "Split open stalks show reddened internal tissues with white transverse bands", "Fermentation sour odor from affected canes"],
        causes: ["Infected seed setts and waterlogged soil conditions"],
        organicTreatment: ["Hot water sett treatment (50°C for 2 hours)", "Apply Trichoderma viride enriched pressmud @ 2 tonnes/acre"],
        chemicalTreatment: ["Carbendazim 50% WP @ 1 g/L sett dip treatment for 15 minutes before planting"],
        prevention: ["Use certified disease-free nursery seed setts", "Do not ratoon severely infected sugarcane fields", "Ensure proper field drainage"]
      }
    ]
  },
  {
    id: "potato",
    name: "Potato",
    localNames: {
      en: "Potato", te: "బంగాళాదుంప (Potato)", hi: "आलू", ta: "உருளைக்கிழங்கு", kn: "ಆಲೂಗಡ್ಡೆ",
      ml: "ഉരുളക്കിഴങ്ങ്", mr: "बटाटा", bn: "আলু", gu: "બટાકા", pa: "ਆਲੂ", or: "ଆଳୁ", as: "আলু", ur: "آلو"
    },
    scientificName: "Solanum tuberosum",
    category: "Vegetables",
    season: "Rabi (Oct - March)",
    optimalTemperature: "16°C - 24°C",
    soilType: "Loose, friable sandy loam rich in humus (pH 5.5 - 6.5)",
    waterRequirement: "Medium",
    durationDays: "80 - 110 days",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "Earthing up at 30 days after planting is crucial to prevent greening of tubers by sunlight.",
      "Stop irrigation 10-12 days before harvest to harden the tuber skin."
    ],
    commonDiseases: [
      {
        id: "potato-late-blight",
        name: "Late Blight of Potato",
        scientificName: "Phytophthora infestans",
        severity: "High",
        symptoms: ["Water-soaked dark lesions on leaf tips and margins", "White mildew growth on leaf undersides in morning dew", "Decaying tubers with reddish-brown dry rot"],
        causes: ["High humidity (>90%) with cool temperature (15-20°C)"],
        organicTreatment: ["Bordeaux mixture 1% spray before onset of foggy weather", "Bio-fungicide Pseudomonas fluorescens @ 5g/L"],
        chemicalTreatment: ["Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L", "Dimethomorph 50% WP @ 1 g/L water"],
        prevention: ["Plant certified seed tubers (Kufri Pukhraj, Kufri Jyoti)", "Dehaulm (cut foliage) 10 days before harvesting"]
      }
    ]
  },
  {
    id: "onion",
    name: "Onion",
    localNames: {
      en: "Onion", te: "ఉల్లిపాయ (Onion)", hi: "प्याज", ta: "வெங்காயம்", kn: "ಈರುಳ್ಳಿ",
      ml: "ഉള്ളി", mr: "कांदा", bn: "পেঁয়াজ", gu: "ડુંગળી", pa: "ਪਿਆਜ਼", or: "ପିଆଜ", as: "পিয়াঁজ", ur: "پیاز"
    },
    scientificName: "Allium cepa",
    category: "Vegetables",
    season: "Kharif, Late Kharif, and Rabi",
    optimalTemperature: "15°C - 30°C",
    soilType: "Well-drained fertile sandy loam or alluvial soil with pH 6.5 - 7.5",
    waterRequirement: "Medium",
    durationDays: "100 - 140 days",
    imageUrl: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "Frequent light irrigations are preferred over heavy flooding.",
      "Stop irrigation 15 days before harvesting and allow tops to fall naturally."
    ],
    commonDiseases: [
      {
        id: "onion-purple-blotch",
        name: "Purple Blotch of Onion",
        scientificName: "Alternaria porri",
        severity: "High",
        symptoms: ["Small water-soaked sunken lesions turning purple in center", "Leaves turn yellow and collapse from lesion site", "Neck rot of bulbs in storage"],
        causes: ["Warm humid weather (25-30°C) with persistent dew"],
        organicTreatment: ["Spray NSKE 5% + Cow urine 5% every 10 days", "Apply Trichoderma viride @ 5g/L water"],
        chemicalTreatment: ["Difenoconazole 25% EC @ 1 mL/L water", "Tebuconazole 25.9% EC @ 1 mL/L water", "Mancozeb 75% WP @ 2.5 g/L"],
        prevention: ["Use disease-free sets / seedlings", "Ensure wide spacing", "Cure bulbs thoroughly in shade before storage"]
      }
    ]
  },
  {
    id: "mango",
    name: "Mango",
    localNames: {
      en: "Mango", te: "మామిడి (Mango)", hi: "आम", ta: "மாம்பழம்", kn: "ಮಾವು",
      ml: "മാങ്ങ", mr: "आंबा", bn: "আম", gu: "કેરી", pa: "ਅੰਬ", or: "ଆମ୍ବ", as: "আম", ur: "آم"
    },
    scientificName: "Mangifera indica",
    category: "Fruits",
    season: "Perennial (Flowering Dec-Feb, Harvest April-July)",
    optimalTemperature: "24°C - 30°C",
    soilType: "Deep, well-drained rich alluvial or red loamy soil (pH 5.5 - 7.5)",
    waterRequirement: "Low",
    durationDays: "Perennial tree crop",
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "Stop irrigation 2 months prior to flowering to induce healthy flower bud differentiation.",
      "Prune dead and criss-cross branches after post-harvest in July-August."
    ],
    commonDiseases: [
      {
        id: "mango-powdery-mildew",
        name: "Powdery Mildew & Anthracnose",
        scientificName: "Oidium mangiferae / Colletotrichum gloeosporioides",
        severity: "High",
        symptoms: ["White powdery fungal growth covering floral panicles", "Blossoms turn brown, dry up, and drop", "Black tear-stain lesions on fruits"],
        causes: ["Cool nights with warm humid days during flowering stage"],
        organicTreatment: ["Spray Wettable Sulfur 80% WP @ 3g/L before flower opening", "Apply neem oil 10,000 ppm @ 2 mL/L"],
        chemicalTreatment: ["Hexaconazole 5% SC @ 1.5 mL/L water", "Azoxystrobin 23% SC @ 1 mL/L water"],
        prevention: ["Prune tree canopy to maximize direct sunlight", "First spray when flower panicles are 3-5 inches long"]
      }
    ]
  },
  {
    id: "banana",
    name: "Banana",
    localNames: {
      en: "Banana", te: "అరటి (Banana)", hi: "केला", ta: "வாழை", kn: "ಬಾಳೆ",
      ml: "വാഴ", mr: "கேळी", bn: "কলা", gu: "કેળા", pa: "ਕੇਲਾ", or: "କଦଳୀ", as: "কল", ur: "کیلا"
    },
    scientificName: "Musa acuminata",
    category: "Fruits",
    season: "Year-round planting",
    optimalTemperature: "25°C - 35°C",
    soilType: "Deep, fertile, well-drained clay loam with high organic matter",
    waterRequirement: "High",
    durationDays: "300 - 360 days",
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "De-suckering keeps mother plant vigorous and bunches heavy.",
      "Propping with double bamboo poles protects bunches from storm lodging."
    ],
    commonDiseases: [
      {
        id: "banana-sigatoka",
        name: "Sigatoka Leaf Spot",
        scientificName: "Mycosphaerella musicola",
        severity: "High",
        symptoms: ["Small yellowish spindle streaks parallel to leaf veins", "Dark brown elliptical spots with grey centers", "Premature leaf collapse reducing bunch weight"],
        causes: ["High humidity, warm temperature, and water stagnation"],
        organicTreatment: ["De-leafing and burying infected leaves outside plantation", "Spray mineral oil 1% emulsion + Trichoderma viride"],
        chemicalTreatment: ["Propiconazole 25% EC @ 1 mL/L + mineral oil 10 mL/L water", "Tebuconazole 50% WG @ 0.5 g/L water"],
        prevention: ["Maintain wide spacing for cross ventilation", "Ensure deep drainage ditches around plantation"]
      }
    ]
  },
  {
    id: "coconut",
    name: "Coconut",
    localNames: {
      en: "Coconut", te: "కొబ్బరి (Coconut)", hi: "नारियल", ta: "தேங்காய்", kn: "ತೆಂಗಿನಕಾಯಿ",
      ml: "തേങ്ങ", mr: "नारळ", bn: "নারকেল", gu: "નાળિયેર", pa: "ਨਾਰੀਅਲ", or: "ନଡ଼ିଆ", as: "নাৰিকল", ur: "ناریل"
    },
    scientificName: "Cocos nucifera",
    category: "Fruits",
    season: "Perennial palm",
    optimalTemperature: "25°C - 32°C",
    soilType: "Coastal sandy loam, alluvial, red sandy loam with good drainage",
    waterRequirement: "Medium",
    durationDays: "Perennial (60-80 years lifespan)",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "Apply 50 kg farmyard manure + 1.3 kg Urea + 2 kg Superphosphate + 2 kg Muriate of Potash per palm annually.",
      "Grow green manure crops (Sunnhemp / Cowpea) in palm basins during monsoon."
    ],
    commonDiseases: [
      {
        id: "coconut-bud-rot",
        name: "Bud Rot & Stem Bleeding",
        scientificName: "Phytophthora palmivora",
        severity: "High",
        symptoms: ["Yellowing and rotting of central spindle leaf", "Spindle easily pulls out emitting foul odor", "Exudation of dark reddish liquid through bark cracks"],
        causes: ["Heavy monsoon rains with high relative humidity"],
        organicTreatment: ["Clean crown and place 10g copper sulfate + 10g lime pouch on crown", "Apply Bordeaux paste on stem cracks"],
        chemicalTreatment: ["Copper Oxychloride 50% WP @ 3 g/L crown drenching", "Phosphonic acid @ 3 mL/L root feeding"],
        prevention: ["Prophylactic crown cleaning and 1% Bordeaux mixture spray before monsoon"]
      }
    ]
  },
  {
    id: "turmeric",
    name: "Turmeric",
    localNames: {
      en: "Turmeric", te: "పసుపు (Turmeric)", hi: "हल्दी", ta: "மஞ்சள்", kn: "ಅರಿಶಿನ",
      ml: "മഞ്ഞൾ", mr: "हळद", bn: "হলুদ", gu: "હળદર", pa: "ਹਲਦੀ", or: "ହଳଦୀ", as: "হালধি", ur: "ہلدی"
    },
    scientificName: "Curcuma longa",
    category: "Spices",
    season: "Kharif (May-June to Jan-Feb)",
    optimalTemperature: "20°C - 30°C",
    soilType: "Well-drained fertile sandy loam or clay loam rich in humus",
    waterRequirement: "Medium",
    durationDays: "210 - 270 days",
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "Heavy mulching with green leaves (5 tonnes/acre) at planting and at 45 & 90 days boosts yield.",
      "Rhizome seed treatment with Trichoderma viride prevents basal rot."
    ],
    commonDiseases: [
      {
        id: "turmeric-rhizome-rot",
        name: "Rhizome Rot / Soft Rot",
        scientificName: "Pythium aphanidermatum",
        severity: "High",
        symptoms: ["Water-soaked lesions at collar region of pseudostem", "Leaves turn yellow along margins", "Rhizomes become soft, pulpy, with foul smell"],
        causes: ["Waterlogging in heavy soils during continuous rains"],
        organicTreatment: ["Drench soil with Trichoderma harzianum @ 10g/L", "Improve furrow drainage immediately"],
        chemicalTreatment: ["Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5 g/L drenching", "Copper Oxychloride 50% WP @ 3 g/L"],
        prevention: ["Plant on raised beds (ridge and furrow)", "Select disease-free healthy mother rhizomes"]
      }
    ]
  },
  {
    id: "soybean",
    name: "Soybean",
    localNames: {
      en: "Soybean", te: "సోయాబీన్ (Soybean)", hi: "सोयाबीन", ta: "சோயாபீன்ஸ்", kn: "ಸೋಯಾಬೀನ್",
      ml: "സോയാബീൻ", mr: "सोयाबीन", bn: "সয়াবিন", gu: "સોયાબીન", pa: "ਸੋਇਆਬੀਨ", or: "ସୋୟାବିନ୍", as: "চয়াবিন", ur: "سویا بین"
    },
    scientificName: "Glycine max",
    category: "Pulses",
    season: "Kharif (June - October)",
    optimalTemperature: "20°C - 30°C",
    soilType: "Fertile, well-drained deep black or medium loam (pH 6.5 - 7.5)",
    waterRequirement: "Medium",
    durationDays: "90 - 110 days",
    imageUrl: "https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?auto=format&fit=crop&w=800&q=80",
    growthTips: [
      "Inoculate seed with Bradyrhizobium japonicum before sowing.",
      "Avoid sowing deeper than 3-4 cm to ensure uniform germination."
    ],
    commonDiseases: [
      {
        id: "soybean-yellow-mosaic",
        name: "Soybean Yellow Mosaic Virus (YMV)",
        scientificName: "Mungbean yellow mosaic India virus",
        severity: "High",
        symptoms: ["Bright yellow irregular patches on young leaves", "Leaves turn completely golden yellow and puckered", "Pods are small with few, shriveled seeds"],
        causes: ["Whitefly vector transmission in hot, humid weather"],
        organicTreatment: ["Install 20 yellow sticky traps/acre", "Spray 5% NSKE or 10,000 ppm Neem oil @ 2 mL/L"],
        chemicalTreatment: ["Thiamethoxam 25% WG @ 0.4 g/L water", "Acetamiprid 20% SP @ 0.4 g/L water"],
        prevention: ["Use YMV-resistant cultivars (JS-9560, JS-2034)", "Treat seeds with Imidacloprid 48% FS @ 1.25 mL/kg seed"]
      }
    ]
  }
];

const tsContent = 'import { CropInfo } from "../types";\n\n' +
  'export const CROP_DATABASE: CropInfo[] = ' + JSON.stringify(crops, null, 2) + ';\n\n' +
  'export function getCropById(id: string): CropInfo | undefined {\n' +
  '  return CROP_DATABASE.find(c => c.id.toLowerCase() === id.toLowerCase());\n' +
  '}\n\n' +
  'export function searchCrops(query: string): CropInfo[] {\n' +
  '  if (!query || query.trim() === "") return CROP_DATABASE;\n' +
  '  const q = query.toLowerCase().trim();\n' +
  '  return CROP_DATABASE.filter(c => {\n' +
  '    if (c.name.toLowerCase().includes(q)) return true;\n' +
  '    if (c.scientificName.toLowerCase().includes(q)) return true;\n' +
  '    if (c.category.toLowerCase().includes(q)) return true;\n' +
  '    if (Object.values(c.localNames).some(name => name.toLowerCase().includes(q))) return true;\n' +
  '    if (c.commonDiseases.some(d => d.name.toLowerCase().includes(q) || d.symptoms.some(s => s.toLowerCase().includes(q)))) return true;\n' +
  '    return false;\n' +
  '  });\n' +
  '}\n\n' +
  'export function matchCropFromInput(input: string): CropInfo | undefined {\n' +
  '  if (!input || input.trim() === "") return undefined;\n' +
  '  const clean = input.toLowerCase().trim();\n' +
  '  for (const crop of CROP_DATABASE) {\n' +
  '    if (crop.name.toLowerCase().includes(clean) || clean.includes(crop.id.toLowerCase())) {\n' +
  '      return crop;\n' +
  '    }\n' +
  '    for (const [, localName] of Object.entries(crop.localNames)) {\n' +
  '      if (localName.toLowerCase().includes(clean) || clean.includes(localName.toLowerCase())) {\n' +
  '        return crop;\n' +
  '      }\n' +
  '    }\n' +
  '  }\n' +
  '  return undefined;\n' +
  '}\n';

const outPath = path.join(__dirname, '..', 'src', 'services', 'cropDatabase.ts');
fs.writeFileSync(outPath, tsContent, 'utf8');
console.log('src/services/cropDatabase.ts successfully created with 15 crops!');
