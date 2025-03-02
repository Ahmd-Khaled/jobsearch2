export const imgOrPdfCheck = (req, res, next) => {
  // Check if file is provided
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }
  if (!req.file.path) {
    return res.status(404).json({ message: "File path not found" });
  }

  const allowedMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "application/pdf",
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // File Type & Size Validation
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      message: "Only JPEG, JPG, PNG, WEBP images, and PDF files are allowed",
    });
  }

  if (req.file.size > maxFileSize) {
    return res.status(400).json({ message: "File size exceeds 10MB limit" });
  }

  return next();
};
