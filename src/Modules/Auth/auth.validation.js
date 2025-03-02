import Joi from "joi";

import { generalField } from "../../middlewares/validation.middleware.js";

export const signupSchema = Joi.object({
  firstName: generalField.firstName.required(),
  lastName: generalField.lastName.required(),
  email: generalField.email.required(),
  password: generalField.password.required(),
  confirmPassword: generalField.confirmPassword.required(),
  gender: generalField.gender,
  DOB: generalField.DOB.required(),
  role: generalField.role,
  profilePic: generalField.fileObject,
  coverPic: generalField.fileObject,
  mobileNumber: generalField.mobileNumber,
}).required();

export const confirmOTPSchema = Joi.object({
  otp: generalField.otp.required(),
  email: generalField.email.required(),
  type: generalField.otpType.required(),
}).required();

export const signInSchema = Joi.object({
  email: generalField.email.required(),
  password: generalField.password.required(),
}).required();

export const signUpGoogleSchema = Joi.object({
  idToken: Joi.string().required(),
}).required();

export const signInGoogleSchema = Joi.object({
  idToken: Joi.string().required(),
}).required();

export const forgetPasswordSchema = Joi.object({
  email: generalField.email.required(),
}).required();

export const resetPasswordSchema = Joi.object({
  email: generalField.email.required(),
  otp: generalField.otp.required(),
  password: generalField.password.required(),
}).required();
