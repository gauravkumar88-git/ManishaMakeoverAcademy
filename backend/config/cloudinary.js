const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for images (thumbnails, avatars)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'beauty-master/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, crop: 'limit' }],
  },
});

// Storage for PDFs (notes)
const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "beauty-master/notes",
    resource_type: "raw",
    public_id: `${Date.now()}-${file.originalname.replace(".pdf", "")}`
  }),
})

// Storage for recordings
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'beauty-master/recordings',
    allowed_formats: ['mp4', 'mov', 'avi'],
    resource_type: 'video',
  },
});

const uploadImage = multer({ storage: imageStorage });
const uploadPDF = multer({ storage: pdfStorage });
const uploadVideo = multer({ storage: videoStorage });

module.exports = { cloudinary, uploadImage, uploadPDF, uploadVideo };
