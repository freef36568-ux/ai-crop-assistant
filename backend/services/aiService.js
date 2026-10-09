import dotenv from 'dotenv';
dotenv.config();

const CROP_DATABASE_PATHO = [
  {
    keywords: ['tomato', 'tomat'],
    crop: 'Tomato',
    disease: 'Early Blight',
    scientificName: 'Alternaria solani',
    severity: 'Medium',
    symptoms: 'Concentric dark brown rings on lower leaves, yellow halo around leaf spots, stem lesions.',
    causes: 'High humidity (80%+), warm temperature (24-29°C), splashing rainwater.',
    recommendation: 'Spray Copper Oxychloride 50 WP @ 2.5g/L or Mancozeb 75 WP @ 2g/L. Remove lower infected leaves.',
    organic: ['Neem oil spray (5ml/L)', 'Trichoderma viride bio-fungicide (5g/L)'],
    chemical: ['Copper Oxychloride 50 WP @ 2.5g/L', 'Mancozeb 75 WP @ 2g/L'],
    immediateAction: 'Prune infected lower leaves immediately and destroy them away from field.',
    prevention: ['Crop rotation with non-solanaceous crops', 'Drip irrigation to prevent leaf wetness']
  },
  {
    keywords: ['rice', 'paddy', 'padd'],
    crop: 'Rice',
    disease: 'Bacterial Leaf Blight',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    severity: 'High',
    symptoms: 'Water-soaked translucent streaks on leaf margins, leaves turn grayish-white and dry up.',
    causes: 'Excess nitrogen fertilizer, high humidity, standing water with wind damage.',
    recommendation: 'Drain excess water. Spray Streptocycline @ 0.1g/L + Copper Oxychloride @ 2g/L.',
    organic: ['Pseudomonas fluorescens @ 10g/L', 'Neem seed kernel extract 5%'],
    chemical: ['Streptocycline 6g + Copper Oxychloride 500g in 200L water per acre'],
    immediateAction: 'Drain field water immediately and pause nitrogen fertilization for 10 days.',
    prevention: ['Use resistant paddy varieties like Swarna Mukhi', 'Balanced NPK application']
  },
  {
    keywords: ['cotton', 'cott'],
    crop: 'Cotton',
    disease: 'Bacterial Blight (Angular Leaf Spot)',
    scientificName: 'Xanthomonas citri pv. malvacearum',
    severity: 'High',
    symptoms: 'Water-soaked angular spots on leaf veins, black arm lesions on stems and bolls.',
    causes: 'Humid weather, infected seeds, wind-driven rain droplets.',
    recommendation: 'Spray Streptocycline @ 0.1g/L + Copper Oxychloride @ 2.5g/L.',
    organic: ['Seed treatment with Trichoderma (10g/kg)', 'Spray NSKE 5%'],
    chemical: ['Streptocycline 100ppm + Copper Oxychloride 0.25%'],
    immediateAction: 'Remove heavily infected bolls and stems from the plant.',
    prevention: ['Acid delinting of cotton seeds before sowing', 'Avoid flood irrigation']
  },
  {
    keywords: ['chilli', 'chili', 'pepper'],
    crop: 'Chilli',
    disease: 'Chilli Leaf Curl Virus',
    scientificName: 'Begomovirus',
    severity: 'High',
    symptoms: 'Downward curling of leaves, stunted plant growth, small puckered leaves, reduced fruiting.',
    causes: 'Transmitted by Whitefly (Bemisia tabaci) vector in dry sunny weather.',
    recommendation: 'Control whiteflies using Imidacloprid 17.8 SL @ 0.5ml/L or Acetamiprid 20 SP @ 0.2g/L.',
    organic: ['Yellow sticky traps (15 traps/acre)', 'Neem oil 10,000 ppm @ 2ml/L'],
    chemical: ['Imidacloprid 17.8 SL @ 0.5ml/L', 'Fipronil 5 SC @ 2ml/L'],
    immediateAction: 'Uproot and burn severely infected viral plants to prevent vector spread.',
    prevention: ['Install yellow sticky traps', 'Intercrop with maize or sorghum as border crops']
  },
  {
    keywords: ['potato', 'potat'],
    crop: 'Potato',
    disease: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    severity: 'High',
    symptoms: 'Water-soaked dark lesions on leaf tips, white moldy growth on leaf undersides in morning dew.',
    causes: 'Cool wet weather (15-20°C) with relative humidity above 90%.',
    recommendation: 'Spray Cymoxanil + Mancozeb @ 2g/L or Metalaxyl + Mancozeb @ 2.5g/L.',
    organic: ['Trichoderma harzianum soil application', 'Copper hydroxide spray'],
    chemical: ['Cymoxanil 8% + Mancozeb 64% WP @ 2g/L', 'Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/L'],
    immediateAction: 'Destroy infected foliage before tuber harvest to prevent tuber rot.',
    prevention: ['Use certified disease-free tubers', 'Proper hilling up of soil around tubers']
  },
  {
    keywords: ['wheat', 'whea'],
    crop: 'Wheat',
    disease: 'Yellow Rust (Stripe Rust)',
    scientificName: 'Puccinia striiformis',
    severity: 'High',
    symptoms: 'Bright yellow pustules arranged in linear stripes along leaf veins.',
    causes: 'Cool temperatures (10-15°C) with high humidity and morning dew.',
    recommendation: 'Spray Propiconazole 25 EC @ 1ml/L or Tebuconazole 250 EC @ 1ml/L.',
    organic: ['Bio-control with Bacillus subtilis'],
    chemical: ['Propiconazole 25 EC @ 1ml/L'],
    immediateAction: 'Spray fungicide immediately at first appearance of yellow stripes.',
    prevention: ['Plant resistant wheat varieties like HD 2967', 'Avoid late sowing']
  },
  {
    keywords: ['maize', 'corn'],
    crop: 'Maize',
    disease: 'Maydis Leaf Blight',
    scientificName: 'Bipolaris maydis',
    severity: 'Medium',
    symptoms: 'Elongated rectangular grayish-tan lesions bounded by leaf veins.',
    causes: 'Warm (20-32°C) and humid weather with frequent rains.',
    recommendation: 'Spray Mancozeb 75 WP @ 2g/L or Zineb 75 WP @ 2g/L.',
    organic: ['Spray Neem Seed Kernel Extract (NSKE) 5%'],
    chemical: ['Mancozeb 75 WP @ 2.5g/L'],
    immediateAction: 'Remove infected lower leaves and maintain row spacing.',
    prevention: ['Crop rotation with legumes', 'Use certified disease-tolerant hybrid seeds']
  }
];

const GEMINI_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest'
];

function parseImageData(imageBufferOrBase64) {
  let base64Image = '';
  let mimeType = 'image/jpeg';

  if (Buffer.isBuffer(imageBufferOrBase64)) {
    if (imageBufferOrBase64.length >= 4) {
      if (imageBufferOrBase64[0] === 0x89 && imageBufferOrBase64[1] === 0x50 && imageBufferOrBase64[2] === 0x4e && imageBufferOrBase64[3] === 0x47) {
        mimeType = 'image/png';
      } else if (imageBufferOrBase64[0] === 0xff && imageBufferOrBase64[1] === 0xd8) {
        mimeType = 'image/jpeg';
      } else if (imageBufferOrBase64.slice(0, 4).toString() === 'RIFF' && imageBufferOrBase64.slice(8, 12).toString() === 'WEBP') {
        mimeType = 'image/webp';
      }
    }
    base64Image = imageBufferOrBase64.toString('base64');
  } else if (typeof imageBufferOrBase64 === 'string') {
    const match = imageBufferOrBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
    if (match) {
      mimeType = match[1];
    }
    base64Image = imageBufferOrBase64.replace(/^data:image\/\w+;base64,/, '').trim();
  }

  return { base64Image, mimeType };
}

async function callGeminiVision(promptText, base64Image, mimeType = 'image/jpeg') {
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('API_KEY_NOT_CONFIGURED');
  }

  let lastError = null;
  for (const model of GEMINI_MODELS) {
    try {
      console.log(`[Crop Detection] Sending image to Gemini (${model})`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: promptText },
                  {
                    inline_data: {
                      mime_type: mimeType,
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        console.log(`[Crop Detection] Gemini response received`);
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
        if (cleanedText) {
          try {
            return JSON.parse(cleanedText);
          } catch (jsonErr) {
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              return JSON.parse(jsonMatch[0]);
            }
          }
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error?.message || response.statusText;
        console.warn(`[Crop Detection] Gemini model ${model} returned ${response.status}: ${errMsg}`);
        lastError = new Error(errMsg);
      }
    } catch (err) {
      console.warn(`[Crop Detection] Gemini error with ${model}:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini Vision models failed');
}

export const aiService = {
  async analyzeImage(imageBufferOrBase64, cropInput = '', language = 'en') {
    const { base64Image, mimeType } = parseImageData(imageBufferOrBase64);

    if (!base64Image || base64Image.length < 50) {
      return {
        crop: 'Unknown',
        cropName: 'Unknown',
        disease: 'Unknown',
        diseaseName: 'Unknown',
        confidence: 0,
        isPlant: false,
        severity: 'Low',
        symptoms: ['No image uploaded or image data is corrupted.'],
        causes: ['Invalid image format or empty payload.'],
        recommendation: 'Please upload a valid crop leaf image.',
        organic: [],
        chemical: [],
        immediateAction: 'Upload a valid image.',
        prevention: ['Ensure image is a valid JPG, PNG, or WebP.'],
      };
    }

    const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

    // 1. Check crop detection to know whether this is a real plant
    let detectedCrop = null;
    try {
      detectedCrop = await this.detectCrop(imageBufferOrBase64, language);
    } catch (e) {
      console.warn('Pre-detection check error:', e.message);
    }

    // If pre-detection confirmed non-plant, return strict Unknown response
    if (detectedCrop && (!detectedCrop.is_plant || detectedCrop.crop === 'Unknown') && !cropInput) {
      return {
        crop: 'Unknown',
        cropName: 'Unknown',
        disease: 'Unknown',
        diseaseName: 'Unknown',
        scientificName: '',
        confidence: 0,
        isPlant: false,
        severity: 'Low',
        symptoms: ['No agricultural crop leaf recognized in uploaded image.'],
        causes: ['Uploaded image does not appear to be an agricultural crop.'],
        recommendation: 'Please upload a clear photograph of an infected plant or crop leaf.',
        organic: [],
        chemical: [],
        immediateAction: 'Please upload a clear crop leaf photo.',
        prevention: ['Ensure clean crop leaf photography in good lighting.'],
      };
    }

    const effectiveCrop = (detectedCrop && detectedCrop.crop !== 'Unknown') ? detectedCrop.crop : cropInput;

    // 2. Call Gemini Vision API for disease diagnosis if key available
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const promptText = `You are an expert Indian Agronomist and Plant Pathologist.
Analyze this agricultural crop leaf image carefully.
Language: ${language}.
Identified Crop context: ${effectiveCrop || 'Agricultural Crop'}.

First verify again if this is a real crop/plant leaf.
If the image does NOT contain a plant leaf:
Set crop to "Unknown", disease to "Unknown", confidence to 0, isPlant to false.

If it IS a valid crop leaf, diagnose any disease, nutritional deficiency, pest attack, or confirm if the leaf is healthy.
Respond ONLY with a valid JSON object matching this schema:
{
  "isPlant": true,
  "crop": "Crop Name (e.g. ${effectiveCrop || 'Tomato, Potato, Rice, Wheat, Cotton, Chilli, Groundnut, Sugarcane, Banana, Mango'})",
  "disease": "Specific Disease Name (e.g. Early Blight, Late Blight, Leaf Curl, Yellow Rust, Anthracnose) or 'Healthy Crop' or 'Unknown'",
  "scientificName": "Scientific Latin Name of pathogen or plant",
  "confidence": integer between 70 and 98,
  "severity": "Low" | "Medium" | "High" | "Healthy",
  "symptoms": "Detailed visual symptoms observed on leaf",
  "causes": "Environmental triggers, weather, pathogen, or vector causes",
  "recommendation": "Summary of treatment and management advice",
  "organic": ["Specific organic control remedy 1 with metric dosage (e.g. Neem oil 5ml/L, Trichoderma viride 5g/L, NSKE 5%)", "Organic remedy 2"],
  "chemical": ["Specific chemical fungicide/insecticide 1 with exact metric dosage (e.g. Copper Oxychloride 50 WP @ 2.5g/L, Mancozeb 75 WP @ 2g/L, Imidacloprid 17.8 SL @ 0.5ml/L)", "Chemical remedy 2 with dosage"],
  "immediateAction": "Immediate step the farmer must take today",
  "prevention": ["Cultural practice 1 to prevent recurrence", "Crop management tip 2"]
}`;

        const parsed = await callGeminiVision(promptText, base64Image, mimeType);
        if (parsed) {
          if (!parsed.isPlant || parsed.crop === 'Unknown' || parsed.disease === 'Unknown' || parsed.confidence === 0) {
            return {
              crop: 'Unknown',
              cropName: 'Unknown',
              disease: 'Unknown',
              diseaseName: 'Unknown',
              scientificName: '',
              confidence: 0,
              isPlant: false,
              severity: 'Low',
              symptoms: ['No agricultural crop leaf recognized in uploaded image.'],
              causes: ['Uploaded image is not a recognized plant or crop leaf.'],
              recommendation: 'Please upload a clear photograph of an infected plant or crop leaf.',
              organic: [],
              chemical: [],
              immediateAction: 'Upload a clear crop leaf photo.',
              prevention: ['Ensure clean crop leaf photography in good lighting.'],
            };
          }

          return {
            crop: parsed.crop || effectiveCrop || 'Unknown',
            cropName: parsed.crop || effectiveCrop || 'Unknown',
            disease: parsed.disease || 'Unable to determine',
            diseaseName: parsed.disease || 'Unable to determine',
            scientificName: parsed.scientificName || '',
            confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 85,
            isPlant: true,
            severity: parsed.severity || 'Medium',
            symptoms: parsed.symptoms || 'Symptoms observed on crop leaf.',
            causes: parsed.causes || 'Environmental factors and pathogen presence.',
            recommendation: parsed.recommendation || 'Apply recommended organic or chemical treatment.',
            organic: Array.isArray(parsed.organic) ? parsed.organic : ['Neem oil spray (5ml/L)'],
            chemical: Array.isArray(parsed.chemical) ? parsed.chemical : ['Copper Oxychloride 50 WP @ 2.5g/L'],
            immediateAction: parsed.immediateAction || 'Prune infected leaves and destroy away from field.',
            prevention: Array.isArray(parsed.prevention) ? parsed.prevention : ['Crop rotation and clean field cultivation.'],
          };
        }
      } catch (err) {
        console.warn('Gemini disease diagnosis failed, checking local database:', err.message);
      }
    }

    // 3. Fallback to CROP_DATABASE_PATHO only if a specific crop was confirmed
    if (effectiveCrop && effectiveCrop.toLowerCase() !== 'unknown') {
      const cropSearch = effectiveCrop.toLowerCase();
      const matched = CROP_DATABASE_PATHO.find((item) =>
        item.keywords.some((kw) => cropSearch.includes(kw))
      );

      if (matched) {
        return {
          crop: matched.crop,
          cropName: matched.crop,
          disease: matched.disease,
          diseaseName: matched.disease,
          scientificName: matched.scientificName,
          confidence: detectedCrop?.confidence || 85,
          isPlant: true,
          severity: matched.severity,
          symptoms: matched.symptoms,
          causes: matched.causes,
          recommendation: matched.recommendation,
          organic: matched.organic,
          chemical: matched.chemical,
          immediateAction: matched.immediateAction,
          prevention: matched.prevention,
        };
      }
    }

    // Default Unknown fallback
    return {
      crop: 'Unknown',
      cropName: 'Unknown',
      disease: 'Unknown',
      diseaseName: 'Unknown',
      scientificName: '',
      confidence: 0,
      isPlant: false,
      severity: 'Low',
      symptoms: ['No recognized crop leaf in the uploaded image.'],
      causes: ['Uploaded image could not be matched to an agricultural crop.'],
      recommendation: 'Please upload a clear photograph of an infected plant or crop leaf.',
      organic: [],
      chemical: [],
      immediateAction: 'Ensure clear leaf photography and adequate lighting.',
      prevention: ['Proper farm hygiene and crop rotation.'],
    };
  },

  async detectCrop(imageBufferOrBase64, language = 'en') {
    console.log('[Crop Detection] Image received');
    const { base64Image, mimeType } = parseImageData(imageBufferOrBase64);

    if (!base64Image || base64Image.length < 50) {
      console.log('[Crop Detection] Final result: Invalid or empty image payload');
      return {
        crop: 'Unknown',
        cropName: 'Unknown',
        crop_name: 'Unknown',
        confidence: 0,
        identified: false,
        is_certain: false,
        isCertain: false,
        is_plant: false,
        isPlant: false,
        isRecognized: false,
        reason: 'non_plant',
        message: 'No valid image data provided.',
      };
    }

    const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const promptText = `You are an expert Agronomist and Computer Vision AI specialized in Indian and global crops.
Carefully examine this image pixel by pixel.

STEP 1: IS THIS AN ACTUAL AGRICULTURAL PLANT, CROP, OR PLANT LEAF?
Note: A plucked leaf, close-up of a leaf, diseased leaf on a plain/white/neutral background, or leaf held in hand IS an authentic plant/crop specimen!
Non-plant images strictly include:
- A human face, selfie, person, body part (without plant specimen)
- An animal, pet, bird, or vehicle
- A building, road, room, or furniture
- Processed food, cooked meal, beverage
- A screenshot, document, diagram, logo, cartoon, drawing, toy, electronic device
- Random household or industrial objects
- Completely blurry, dark, unidentifiable, or corrupted images

If the image contains NO plant/leaf matter, or is completely unidentifiable:
You MUST respond with:
{
  "isPlant": false,
  "crop": "Unknown",
  "cropName": "Unknown",
  "confidence": 0,
  "reason": "non_plant"
}

STEP 2: IF IT IS A REAL PLANT/LEAF:
Determine if the specific crop species can be identified from clear botanical evidence (leaf shape, venation, color, lesions, stem, flower, or fruit).
Supported agricultural crops include:
Tomato, Potato, Rice, Wheat, Cotton, Chilli, Groundnut, Sugarcane, Banana, Mango, Maize, Soybean, Brinjal, Onion, Garlic, Mustard, Gram, Turmeric, Ginger, Coffee, Tea, Papaya, Guava, Apple, Citrus, etc.

- If the crop species CANNOT be identified reliably or is ambiguous:
{
  "isPlant": true,
  "crop": "Unknown",
  "cropName": "Unknown",
  "confidence": 30,
  "reason": "unclear"
}

- If the crop IS clearly identified:
{
  "isPlant": true,
  "crop": "Exact Standard English Crop Name (e.g. Tomato, Potato, Rice, Wheat, Cotton, Chilli, Groundnut, Sugarcane, Banana, Mango)",
  "cropName": "Exact Standard English Crop Name",
  "confidence": integer between 70 and 99 reflecting true visual certainty,
  "reason": "recognized"
}

Respond ONLY with the JSON object. Do not include markdown or explanations outside the JSON.`;

        const parsed = await callGeminiVision(promptText, base64Image, mimeType);
        console.log('[Crop Detection] Parsed result:', JSON.stringify(parsed));

        const cropRaw = parsed.cropName || parsed.crop || parsed.crop_name || 'Unknown';
        const isPlantRaw = Boolean(parsed.isPlant ?? parsed.is_plant);
        const crop = (isPlantRaw && cropRaw.toLowerCase() !== 'unknown') ? cropRaw : 'Unknown';
        const isPlant = isPlantRaw && crop !== 'Unknown' ? true : Boolean(parsed.isPlant ?? parsed.is_plant);
        const conf = crop === 'Unknown'
          ? (isPlant ? Math.min(Number(parsed.confidence) || 30, 45) : 0)
          : Math.max(Math.min(Number(parsed.confidence) || 85, 99), 50);

        const result = {
          crop,
          cropName: crop,
          crop_name: crop,
          confidence: conf,
          identified: crop !== 'Unknown',
          is_certain: conf >= 80,
          isCertain: conf >= 80,
          is_plant: isPlant,
          isPlant: isPlant,
          isRecognized: crop !== 'Unknown',
          reason: parsed.reason || (crop !== 'Unknown' ? 'recognized' : (isPlant ? 'unclear' : 'non_plant')),
        };

        console.log('[Crop Detection] Final result:', JSON.stringify(result));
        return result;
      } catch (err) {
        console.warn('[Crop Detection] Gemini vision call failed, falling back:', err.message);
      }
    }

    // Fallback if API key missing or network error
    const fallbackResult = {
      crop: 'Unknown',
      cropName: 'Unknown',
      crop_name: 'Unknown',
      confidence: 0,
      identified: false,
      is_certain: false,
      isCertain: false,
      is_plant: false,
      isPlant: false,
      isRecognized: false,
      reason: 'api_error',
      message: 'AI Vision API error or unconfigured API key. Please check backend/.env configuration.',
    };
    console.log('[Crop Detection] Final result:', JSON.stringify(fallbackResult));
    return fallbackResult;
  },

  async chatWithAssistant(messages = [], cropContext = '', language = 'en') {
    const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

    const systemPrompt = `You are AI Crop Assistant Doctor - an expert Indian Agricultural Agronomist and Plant Pathologist.
You provide precise, actionable, and accurate advice for Indian farmers.
Language: ${language}. Always reply in ${language} (or English if language is en).
Context / Current Crop: ${cropContext || 'General Agriculture & Crop Health'}.

Guidelines:
1. Provide accurate diagnoses for crop diseases (blights, wilts, leaf curls, rusts, mildews, sap-sucking pests).
2. Recommend SPECIFIC organic remedies with exact dosages (e.g., Neem oil 5ml/L, Trichoderma viride 5g/L, NSKE 5%, Pseudomonas fluorescens 10g/L).
3. Recommend SPECIFIC chemical sprays with precise dosages (e.g., Copper Oxychloride 50 WP @ 2.5g/L, Mancozeb 75 WP @ 2g/L, Imidacloprid 17.8 SL @ 0.5ml/L, NPK 19:19:19 @ 5g/L).
4. For yellowing leaves, specify causes (Nitrogen deficiency, waterlogging, or sucking pests like aphids/whiteflies) and remedy.
5. Keep tone respectful, warm, and highly practical ("Namaste Farmer!").`;

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      const contents = [
        { parts: [{ text: systemPrompt }] }
      ];

      messages.forEach((msg) => {
        const role = (msg.sender === 'user' || msg.role === 'user') ? 'user' : 'model';
        contents.push({
          role: role,
          parts: [{ text: msg.text || msg.content || '' }]
        });
      });

      for (const model of GEMINI_MODELS) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) return reply;
          }
        } catch (e) {
          console.warn(`Gemini Chat warning on ${model}:`, e.message);
        }
      }
    }


    const lastUserMessage = (messages[messages.length - 1]?.text || '').toLowerCase();

    if (lastUserMessage.includes('yellow') || lastUserMessage.includes('pila') || lastUserMessage.includes('pasupu')) {
      return `Namaste! Yellowing leaves in ${cropContext || 'crops'} are usually caused by Nitrogen deficiency, root waterlogging, or sap-sucking pests (whiteflies/aphids).

Recommended Treatment:
1. Organic: Spray 5% Neem Seed Kernel Extract (NSKE) or Neem oil @ 5ml/L water.
2. Nutrient Boost: Foliar spray of NPK 19:19:19 @ 5g/L water along with Micronutrient mix (2g/L).
3. Drainage: Ensure water is not standing in the root zone.`;
    }

    if (lastUserMessage.includes('spot') || lastUserMessage.includes('fung') || lastUserMessage.includes('blight') || lastUserMessage.includes('rust')) {
      return `Namaste! Dark spots and leaf lesions indicate fungal or bacterial blight in ${cropContext || 'your field'}.

Recommended Treatment:
1. Organic: Spray Trichoderma viride or Pseudomonas fluorescens @ 5g/L water.
2. Chemical: Spray Copper Oxychloride 50 WP @ 2.5g/L or Mancozeb 75 WP @ 2g/L water. Repeat after 10 days if symptoms persist.
3. Sanitation: Prune severely affected lower leaves and burn them outside the field.`;
    }

    if (lastUserMessage.includes('bug') || lastUserMessage.includes('pest') || lastUserMessage.includes('insect') || lastUserMessage.includes('worm')) {
      return `Namaste! For pest management in ${cropContext || 'your crop'}:

Recommended Action:
1. Yellow/Blue Sticky Traps: Install 15 sticky traps per acre to catch whiteflies, thrips, and aphids.
2. Organic Spray: Neem oil (10,000 ppm) @ 2ml/L water.
3. Chemical Spray: For chewing caterpillars/worms, spray Emamectin Benzoate 5 SG @ 0.5g/L; for sucking pests, spray Imidacloprid 17.8 SL @ 0.5ml/L water.`;
    }

    return `Namaste! As your AI Crop Assistant Doctor for ${cropContext || 'your field'}, I am monitoring your crop's health. 

General Agronomic Guidance:
- For fungal leaf spots: Spray Copper Oxychloride 50 WP @ 2.5g/L.
- For organic pest defense: Spray 5% NSKE or Neem oil (5ml/L).
- For nutrient health: Apply balanced NPK fertilizers and maintain proper field drainage.

Please ask any specific question about leaf spots, pest attacks, or fertilizer dosages for your crop!`;
  },
};
