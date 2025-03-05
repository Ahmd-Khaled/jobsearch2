import * as dbService from "../../DB/dbService.js";
import { ChatModel } from "../../DB/Models/chat.model.js";
import { UserModel } from "../../DB/Models/user.model.js";

// Get chat history with specific user
export const getChatHistory = async (req, res, next) => {
  const userId = req.params.userId;

  const otherUser = await dbService.findOne({
    model: UserModel,
    filter: { _id: userId },
  });

  if (!otherUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Fetch chat history between the two users
  const chatHistory = await dbService.find({
    model: ChatModel,
    filter: { receiverId: userId },
    // filter: { $all: [{ senderId: req.user._id }, { receiverId: userId }] },
  });

  res.status(200).json({
    status: true,
    message: "Chat retrieved successfully",
    ...chatHistory,
  });
};
