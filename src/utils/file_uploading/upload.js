import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_profiles",
    format: async (req, file) => {
      const ext = file.mimetype.split("/")[1];
      return ["jpg", "jpeg", "png"].includes(ext) ? ext : "png";
    },
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

export const upload = multer({ storage: storage });
