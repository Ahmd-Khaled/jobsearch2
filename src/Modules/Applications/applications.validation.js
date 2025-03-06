import Joi from "joi";

import { generalField } from "../../middlewares/validation.middleware.js";

export const exportApplicationsSchema = Joi.object({
  companyId: generalField.id.required(),
  date: generalField.date.required(),
}).required();
