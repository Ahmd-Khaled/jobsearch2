import { Router } from "express";
import { asyncHandler } from "../../utils/error_handling/asyncHandler.js";
import * as userService from "./user.service.js";
import { authentication } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";
import { uploadCloud } from "../../utils/file_uploading/multerCloud.js";
import { imgTypeCheck } from "../../utils/fileCheck/imgTypeCheck.js";

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
  validation(userValidation.getUserProfileDataSchema),
  asyncHandler(userService.getUserProfileData)
);

// Update Password API
router.patch(
  "/update-password",
  authentication(),
  validation(userValidation.updatPasswordSchema),
  asyncHandler(userService.updatPassword)
);

// Upload Profile Pic API
router.patch(
  "/upload-profile-pic",
  authentication(),
  uploadCloud().single("profilePic"),
  imgTypeCheck, // File check and validation
  asyncHandler(userService.uploadProfilePic)
);

// Upload Cover Pic API
router.patch(
  "/upload-cover-pic",
  authentication(),
  uploadCloud().single("coverPic"),
  imgTypeCheck, // File check and validation
  asyncHandler(userService.uploadCoverPic)
);

// Delete Profile Pic API
router.delete(
  "/delete-profile-pic",
  authentication(),
  uploadCloud().single("profilePic"),
  asyncHandler(userService.deleteProfilePic)
);

// Delete Profile Pic API
router.delete(
  "/delete-cover-pic",
  authentication(),
  uploadCloud().single("coverPic"),
  asyncHandler(userService.deleteCoverPic)
);

// Soft Delete Account API
router.post(
  "/soft-delete-account/:userId",
  authentication(),
  validation(userValidation.softDeleteAccountSchema),
  asyncHandler(userService.softDeleteAccount)
);

export default router;
