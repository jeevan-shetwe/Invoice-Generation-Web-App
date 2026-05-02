import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'invoice-generator',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'pdf'],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return file.fieldname + '-' + uniqueSuffix;
    },
    // For PDFs, we need to specify resource_type as 'raw' or 'auto' 
    // but usually 'auto' works for images and 'raw' for others.
    // CloudinaryStorage handles images well by default.
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const isMimeValid = allowedTypes.test(file.mimetype);
  
  if (isMimeValid) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpeg, jpg, png, gif) and PDFs are allowed'));
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});
