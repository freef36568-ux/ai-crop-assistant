import express from 'express';
import { cropController } from '../controllers/cropController.js';
import { chatController } from '../controllers/chatController.js';
import { analysesController } from '../controllers/analysesController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// GET /api/health
router.get('/health', cropController.getHealth);

// Analysis history (local cache layer — Firestore is the primary store)
router.get('/analyses', analysesController.getAll);
router.post('/analyses', analysesController.create);
router.delete('/analyses/:id', analysesController.remove);

// POST /api/analyze-crop (Supports multipart/form-data upload or JSON payload)
router.post('/analyze-crop', upload.single('image'), cropController.analyzeCrop);

// POST /api/detect-crop (Auto detect crop from image)
router.post('/detect-crop', upload.single('image'), cropController.detectCrop);

// POST /api/detect-disease
router.post('/detect-disease', upload.single('image'), cropController.detectDisease);

// POST /api/chat
router.post('/chat', chatController.handleChat);

export default router;
