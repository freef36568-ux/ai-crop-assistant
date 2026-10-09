import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/apiRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Always load backend/.env regardless of the working directory this is launched from
// (e.g. `node backend/server.js` from the repo root, where process.cwd() is NOT backend/).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all frontend origins (mobile, local, and deployed)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Mount API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🌱 AI Crop Assistant Express Backend REST API Server is Running!',
    endpoints: {
      health: 'GET /api/health',
      analyzeCrop: 'POST /api/analyze-crop',
      detectDisease: 'POST /api/detect-disease',
      chat: 'POST /api/chat',
    },
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ AI Crop Assistant Express REST API Backend running on http://localhost:${PORT}`);
});
