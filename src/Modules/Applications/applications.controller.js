import { Router } from "express";
import * as applicationService from "./applications.service.js";
import * as applicationValidation from "./applications.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/error_handling/asyncHandler.js";
import { allowTo, authentication } from "../../middlewares/auth.middleware.js";
import { roleTypes } from "../../utils/variables.js";

const router = Router();

// Collects the applications for a specific Company & Job on a specific day API
router.get(
  "/export-to-excel",
  authentication(),
  validation(applicationValidation.exportApplicationsSchema),
  allowTo([roleTypes.User]),
  //   allowTo([roleTypes.Admin]),
  asyncHandler(applicationService.exportCompanyApplications)
);

export default router;
