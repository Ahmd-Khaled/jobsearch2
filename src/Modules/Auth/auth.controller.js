import { Router } from "express";
import * as authService from "./auth.service.js";
import * as authValidation from "./auth.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/error_handling/asyncHandler.js";
import { uploadCloud } from "../../utils/file_uploading/multerCloud.js";
import { authentication } from "../../middlewares/auth.middleware.js";

const router = Router();
// Sign Up API
router.post(
  "/signup",
  uploadCloud().fields([{ name: "profilePic" }, { name: "coverPic" }]),
  validation(authValidation.signupSchema),
  asyncHandler(authService.signup)
);
// Confirm OTP API
router.patch(
  "/confirm-otp",
  validation(authValidation.confirmOTPSchema),
  asyncHandler(authService.confirmOTP)
);
// Sign In API
router.post(
  "/signin",
  validation(authValidation.signInSchema),
  asyncHandler(authService.signIn)
);

// SignUp with Google API
router.post(
  "/signup-google",
  validation(authValidation.signUpGoogleSchema),
  asyncHandler(authService.signUpGoogle)
);

// SignIn with Google API
router.post(
  "/signin-google",
  validation(authValidation.signInGoogleSchema),
  asyncHandler(authService.signInGoogle)
);

// Forget Password API
router.post(
  "/forget-password",
  validation(authValidation.forgetPasswordSchema),
  asyncHandler(authService.forgetPassword)
);

// Reset Password API
router.post(
  "/reset-password",
  validation(authValidation.resetPasswordSchema),
  asyncHandler(authService.resetPassword)
);

// Refresh Token API
router.post(
  "/refresh-token",
  authentication(),
  asyncHandler(authService.refreshToken)
);

export default router;
