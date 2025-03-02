import { Router } from "express";
import * as companyService from "./company.service.js";
import * as companyValidation from "./company.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/error_handling/asyncHandler.js";
import { authentication } from "../../middlewares/auth.middleware.js";
import { uploadCloud } from "../../utils/file_uploading/multerCloud.js";
import { imgOrPdfCheck } from "../../utils/fileCheck/imgOrPdfCheck.js";

const router = Router();

// Add Company API
router.post(
  "/add",
  authentication(),
  uploadCloud().single("legalAttachment"),
  imgOrPdfCheck, // File check and validation
  validation(companyValidation.addCompanySchema),
  asyncHandler(companyService.addCompany)
);

// Update Company data API
router.patch(
  "/update",
  authentication(),
  validation(companyValidation.updateCompanySchema),
  asyncHandler(companyService.updateCompany)
);

export default router;
