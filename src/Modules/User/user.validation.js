import Joi from "joi";
import { generalField } from "../../middlewares/validation.middleware.js";

export const updateUserSchema = Joi.object({
  firstName: generalField.firstName,
  lastName: generalField.lastName,
  gender: generalField.gender,
  DOB: generalField.DOB,
  mobileNumber: generalField.mobileNumber,
}).required();
