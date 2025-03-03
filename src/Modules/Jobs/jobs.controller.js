import { Router } from "express";
import * as jobsService from "./jobs.service.js";
import * as jobsValidation from "./jobs.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/error_handling/asyncHandler.js";
import { allowTo, authentication } from "../../middlewares/auth.middleware.js";
import { roleTypes } from "../../utils/variables.js";

const router = Router();

// Add Job API
router.post(
  "/add-job",
  authentication(),
  validation(jobsValidation.addJobSchema),
  asyncHandler(jobsService.addJob)
);

export default router;
