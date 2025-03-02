import { Router } from "express";
import * as companyService from "./company.service.js";
import * as companyValidation from "./company.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/error_handling/asyncHandler.js";
import { authentication } from "../../middlewares/auth.middleware.js";

const router = Router();
// Add Company API
router.post(
  "/add",
  authentication(),
  validation(companyValidation.addCompanySchema),
  asyncHandler(companyService.addCompany)
);

export default router;
