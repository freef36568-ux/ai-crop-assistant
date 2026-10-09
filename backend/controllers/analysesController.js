import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local JSON file cache of analysis history. The frontend's storageService
// treats this as a secondary/offline layer — Firestore (src/lib/firebase.ts)
// is the primary, real datastore for this project.
const DB_FILE = path.join(__dirname, '..', 'analyses_db.json');

function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Failed to read analyses_db.json:', err);
  }
  return [];
}

function writeDb(analyses) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(analyses, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write analyses_db.json:', err);
  }
}

export const analysesController = {
  getAll(req, res) {
    return res.status(200).json(readDb());
  },

  create(req, res) {
    const newAnalysis = req.body;
    const current = readDb();
    const filtered = current.filter((item) => item.id !== newAnalysis.id);
    const updated = [newAnalysis, ...filtered];
    writeDb(updated);
    return res.status(200).json({ success: true, item: newAnalysis });
  },

  remove(req, res) {
    const { id } = req.params;
    const current = readDb();
    const updated = current.filter((item) => item.id !== id);
    writeDb(updated);
    return res.status(200).json({ success: true, deletedId: id });
  },
};
