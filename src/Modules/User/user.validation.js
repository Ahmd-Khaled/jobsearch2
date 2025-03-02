import Joi from "joi";
import { generalField } from "../../middlewares/validation.middleware.js";

export const updateUserSchema = Joi.object({
  firstName: generalField.firstName,
  lastName: generalField.lastName,
  gender: generalField.gender,
  DOB: generalField.DOB,
  mobileNumber: generalField.mobileNumber,
}).required();

export const getUserProfileDataSchema = Joi.object({
  userId: generalField.id.required(),
});

export const updatPasswordSchema = Joi.object({
  currentPassword: generalField.password.required(),
  newPassword: generalField.password.not(Joi.ref("currentPassword")).required(),
  confirmNewPassword: generalField.confirmNewPassword.required(),
}).required();

export const uploadProfilePicSchema = Joi.object({
  profilePic: generalField.fileObject,
}).required();

export const uploadCoverPicSchema = Joi.object({
  coverPic: generalField.fileObject,
}).required();

export const softDeleteAccountSchema = Joi.object({
  userId: generalField.id.required(),
});
