import Joi from "joi";
import { generalField } from "../../middlewares/validation.middleware.js";

export const getChatHistorySchema = Joi.object({
  userId: generalField.id.required(),
}).required();
