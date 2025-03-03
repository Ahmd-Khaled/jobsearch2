import { Router } from "express";
import * as adminService from "./admin.service.js";
import * as adminValidation from "./admin.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/error_handling/asyncHandler.js";
import { allowTo, authentication } from "../../middlewares/auth.middleware.js";
import { roleTypes } from "../../utils/variables.js";

const router = Router();

// Ban or unbanned specific user API
router.patch(
  "/ban-unBan-user/:userId",
  authentication(),
  validation(adminValidation.banUserSchema),
  allowTo([roleTypes.Admin]),
  asyncHandler(adminService.banUnBanUser)
);

// Ban or unbanned specific company. API
router.patch(
  "/ban-unBan-company/:companyId",
  authentication(),
  validation(adminValidation.banCompanySchema),
  allowTo([roleTypes.Admin]),
  asyncHandler(adminService.banUnBanCompany)
);

// Approve company. API
router.patch(
  "/approve-company/:companyId",
  authentication(),
  validation(adminValidation.approveCompanySchema),
  allowTo([roleTypes.Admin]),
  asyncHandler(adminService.approveCompany)
);

export default router;
