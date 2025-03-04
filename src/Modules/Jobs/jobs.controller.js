import { Router } from "express";
import * as jobsService from "./jobs.service.js";
import * as jobsValidation from "./jobs.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/error_handling/asyncHandler.js";
import { allowTo, authentication } from "../../middlewares/auth.middleware.js";
import { roleTypes } from "../../utils/variables.js";
import { pdfCheck } from "../../utils/fileCheck/pdfCheck.js";
import { uploadCloud } from "../../utils/file_uploading/multerCloud.js";

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

// Get all Jobs with filters without Merge Param API
router.get(
  "/all",
  authentication(),
  validation(jobsValidation.getAllJobsSchema),
  asyncHandler(jobsService.getAllJobs)
);

// Apply to Job (Job application)  API
router.post(
  "/:jobId/apply",
  authentication(),
  allowTo([roleTypes.User]),
  uploadCloud().single("userCV"),
  pdfCheck, // PDF check for CV
  validation(jobsValidation.applyToJobSchema),
  asyncHandler(jobsService.applyToJob)
);

// Get all applications for specific Job API
router.get(
  "/:jobId/applications",
  authentication(),
  validation(jobsValidation.getAllJobApplicationsSchema),
  asyncHandler(jobsService.getAllJobApplications)
);

// Accept or Reject an Applicant (Change its status) API
router.patch(
  "/applications/:applicationId",
  authentication(),
  validation(jobsValidation.changeApplicationStatusSchema),
  asyncHandler(jobsService.changeApplicationStatus)
);

export default router;
