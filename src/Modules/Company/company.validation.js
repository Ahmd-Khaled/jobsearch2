import Joi from "joi";

import { generalField } from "../../middlewares/validation.middleware.js";

export const addCompanySchema = Joi.object({
  firstName: generalField.firstName.required(),
}).required();
