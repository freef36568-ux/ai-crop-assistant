import multer from 'multer';

// Storage configuration: Store in memory as buffer for fast processing
const storage = multer.memoryStorage();

// File filter to allow image types only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, and WEBP images are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max file size
  },
  fileFilter,
});
