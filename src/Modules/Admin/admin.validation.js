import Joi from "joi";

import { generalField } from "../../middlewares/validation.middleware.js";

export const banUserSchema = Joi.object({
  userId: generalField.id.required(),
}).required();

export const banCompanySchema = Joi.object({
  companyId: generalField.id.required(),
}).required();

export const approveCompanySchema = Joi.object({
  companyId: generalField.id.required(),
}).required();
