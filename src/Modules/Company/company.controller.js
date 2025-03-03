import { Router } from "express";
import * as companyService from "./company.service.js";
import * as companyValidation from "./company.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/error_handling/asyncHandler.js";
import { allowTo, authentication } from "../../middlewares/auth.middleware.js";
import { uploadCloud } from "../../utils/file_uploading/multerCloud.js";
import { imgOrPdfCheck } from "../../utils/fileCheck/imgOrPdfCheck.js";
import { roleTypes } from "../../utils/variables.js";
import { imgTypeCheck } from "../../utils/fileCheck/imgTypeCheck.js";

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

// Soft Delete Company data API
router.patch(
  "/soft-delete/:companyId",
  authentication(),
  validation(companyValidation.softDeleteCompanySchema),
  allowTo([roleTypes.Admin, roleTypes.User]),
  asyncHandler(companyService.softDeleteCompany)
);
// Search Company by name API
router.get(
  "/search",
  authentication(),
  validation(companyValidation.searchCompanyByNameSchema),
  asyncHandler(companyService.searchCompanyByName)
);

// Get specific company with related jobs API
router.get(
  "/:companyId",
  authentication(),
  validation(companyValidation.getCompanyByIdSchema),
  asyncHandler(companyService.getCompanyById)
);

// Upload company logo API
router.patch(
  "/upload-logo",
  authentication(),
  uploadCloud().single("logo"),
  imgTypeCheck, // File check and validation
  asyncHandler(companyService.uploadLogo)
);

// Upload company Cover Pic API
router.patch(
  "/upload-cover-pic",
  authentication(),
  uploadCloud().single("coverPic"),
  imgTypeCheck, // File check and validation
  asyncHandler(companyService.uploadCoverPic)
);

// Delete company logo API
router.patch(
  "/delete-logo",
  authentication(),
  uploadCloud().single("logo"),
  asyncHandler(companyService.deleteLogo)
);

// Delete company cover pic API
router.patch(
  "/delete-cover-pic",
  authentication(),
  uploadCloud().single("coverPic"),
  asyncHandler(companyService.deleteCoverPic)
);

export default router;
