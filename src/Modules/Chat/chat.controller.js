import { Router } from "express";
import * as chatService from "./chat.service.js";
import * as chatValidation from "./chat.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/error_handling/asyncHandler.js";
import { authentication } from "../../middlewares/auth.middleware.js";

const router = Router();

// Get chat history with specific user API
router.get(
  "/:userId",
  authentication(),
  validation(chatValidation.getChatHistorySchema),
  asyncHandler(chatService.getChatHistory)
);

export default router;
