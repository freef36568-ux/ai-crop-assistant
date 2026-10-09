import { aiService } from '../services/aiService.js';

export const cropController = {
  // GET /api/health
  getHealth(req, res) {
    return res.status(200).json({
      status: 'ok',
      app: 'AI Crop Assistant Express Backend REST API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  },

  // POST /api/analyze-crop
  async analyzeCrop(req, res, next) {
    try {
      let imageInput = null;
      let cropName = req.body?.cropName || req.body?.crop || '';
      let language = req.body?.language || 'en';

      // 1. If file uploaded via multipart/form-data (multer)
      if (req.file) {
        imageInput = req.file.buffer;
      }
      // 2. If base64 image passed in JSON body
      else if (req.body?.image) {
        imageInput = req.body.image;
      }

      if (!imageInput || (Buffer.isBuffer(imageInput) && imageInput.length === 0) || (typeof imageInput === 'string' && imageInput.trim().length === 0)) {
        return res.status(400).json({
          status: 'error',
          error: 'No image uploaded. Please provide a crop image using multipart/form-data (field: image) or base64 JSON.',
        });
      }

      const result = await aiService.analyzeImage(imageInput, cropName, language);
      const isPlant = Boolean(result.isPlant ?? result.is_plant);
      const isUnknown = !isPlant || result.crop === 'Unknown';

      return res.status(200).json({
        crop: result.crop || 'Unknown',
        cropName: result.cropName || result.crop || 'Unknown',
        disease: result.disease || 'Unknown',
        diseaseName: result.diseaseName || result.disease || 'Unknown',
        confidence: typeof result.confidence === 'number' ? result.confidence : (isUnknown ? 0 : 85),
        isPlant: isPlant,
        is_plant: isPlant,
        severity: result.severity || (isUnknown ? 'Low' : 'Medium'),
        symptoms: result.symptoms || (isUnknown ? 'No plant or crop leaf recognized in uploaded image.' : 'Symptoms observed on crop leaf.'),
        causes: result.causes || '',
        recommendation: result.recommendation || (isUnknown ? 'Please upload a clear photograph of an infected plant or crop leaf.' : 'Apply bio-fungicide or neem oil spray.'),
        organic: Array.isArray(result.organic) ? result.organic : [],
        chemical: Array.isArray(result.chemical) ? result.chemical : [],
        immediateAction: result.immediateAction || (isUnknown ? 'Upload a clear crop leaf photo.' : 'Isolate infected plants.'),
        prevention: Array.isArray(result.prevention) ? result.prevention : [],
        scientificName: result.scientificName || '',
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/detect-disease
  async detectDisease(req, res, next) {
    try {
      let imageInput = req.file ? req.file.buffer : req.body?.image;
      let cropName = req.body?.cropName || req.body?.crop || '';
      let language = req.body?.language || 'en';

      if (!imageInput || (Buffer.isBuffer(imageInput) && imageInput.length === 0) || (typeof imageInput === 'string' && imageInput.trim().length === 0)) {
        return res.status(400).json({
          status: 'error',
          error: 'Missing crop image. Upload an image to detect disease.',
        });
      }

      const result = await aiService.analyzeImage(imageInput, cropName, language);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/detect-crop
  async detectCrop(req, res, next) {
    try {
      let imageInput = req.file ? req.file.buffer : req.body?.image;
      let language = req.body?.language || 'en';

      if (!imageInput || (Buffer.isBuffer(imageInput) && imageInput.length === 0) || (typeof imageInput === 'string' && imageInput.trim().length === 0)) {
        return res.status(400).json({
          status: 'error',
          error: 'No image uploaded for crop detection.',
        });
      }

      const result = await aiService.detectCrop(imageInput, language);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
