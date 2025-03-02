export const imgTypeCheck = (req, res, next) => {
  // Check if file is provided
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }
  if (!req.file.path) {
    return res.status(404).json({ message: "File path not found" });
  }

  //   File Type & Size Validation
  if (!["image/png", "image/jpeg", "image/jpg"].includes(req.file.mimetype)) {
    return res
      .status(400)
      .json({ message: "Only JPEG, JPG, and PNG files are allowed" });
  }

  if (req.file.size > 2 * 1024 * 1024) {
    return res.status(400).json({ message: "File size exceeds 2MB limit" });
  }
  return next();
};
