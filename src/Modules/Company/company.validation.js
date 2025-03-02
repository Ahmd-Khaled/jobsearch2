import Joi from "joi";

import { generalField } from "../../middlewares/validation.middleware.js";

export const addCompanySchema = Joi.object({
  companyName: generalField.companyName.required(),
  description: generalField.description,
  industry: generalField.text,
  address: generalField.text,
  numberOfEmployees: generalField.employees,
  companyEmail: generalField.email.required(),
  HRs: generalField.listOfIds.required(),
  file: Joi.object(generalField.fileObject),
});

export const updateCompanySchema = Joi.object({
  companyName: generalField.companyName,
  description: generalField.description,
  industry: generalField.text,
  address: generalField.text,
  numberOfEmployees: generalField.employees,
  companyEmail: generalField.email,
  HRs: generalField.listOfIds,
}).required();
