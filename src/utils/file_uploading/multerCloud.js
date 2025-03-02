import multer, { diskStorage } from "multer";

export const uploadCloud = () => {
  const storage = diskStorage({});

  const multerUpload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedExtensions = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      if (allowedExtensions.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed."
          ),
          false
        );
      }
    },
  });
  return multerUpload;
};
