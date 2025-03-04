import { Router } from "express";
import * as jobsService from "./jobs.service.js";
import * as jobsValidation from "./jobs.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/error_handling/asyncHandler.js";
import { allowTo, authentication } from "../../middlewares/auth.middleware.js";
import { roleTypes } from "../../utils/variables.js";

const router = Router({ mergeParams: true });

// Add Job API
router.post(
  "/add",
  authentication(),
  validation(jobsValidation.addJobSchema),
  asyncHandler(jobsService.addJob)
);

// Update Job API
router.patch(
  "/update/:jobId",
  authentication(),
  validation(jobsValidation.updateJobSchema),
  asyncHandler(jobsService.updateJob)
);

// Delete Job API
router.delete(
  "/delete/:jobId",
  authentication(),
  validation(jobsValidation.deleteJobSchema),
  asyncHandler(jobsService.deleteJob)
);

// Get all Jobs or a specific one for a specific company API
// Using Merge Param
//  /company/:companyId/jobs/all-jobs
router.get(
  "/all-jobs",
  authentication(),
  validation(jobsValidation.getJobsForCompanySchema),
  asyncHandler(jobsService.getJobsForCompany)
);

export default router;
