import { Router } from "express";
import { asyncHandler } from "../../utils/error_handling/asyncHandler.js";
import * as userService from "./user.service.js";
import { authentication } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";

const router = Router();

// Update user account API
router.patch(
  "/update-user",
  authentication(),
  validation(userValidation.updateUserSchema),
  asyncHandler(userService.updateUser)
);

// Get Login user account data API
router.get(
  "/logged-user-data",
  authentication(),
  asyncHandler(userService.getLoggedUserData)
);

// Get profile data for another user API
router.get(
  "/user-profile-data/:userId",
  authentication(),
  asyncHandler(userService.getUserProfileData)
);

export default router;
