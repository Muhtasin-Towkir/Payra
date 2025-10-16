import multer from 'multer';

// Configure multer storage. We use memoryStorage for Cloudinary.
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
});

export { upload };