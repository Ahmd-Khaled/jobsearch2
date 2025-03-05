import * as dbService from "../../../DB/dbService.js";
import { ChatModel } from "../../../DB/Models/chat.model.js";
import { CompanyModel } from "../../../DB/Models/company.model.js";
import { UserModel } from "../../../DB/Models/user.model.js";
import { now } from "../../../utils/variables.js";

export const sendRealTimeMessage = function (socket, io) {
  return async ({ message, userId, companyId }) => {
    const sender = await dbService.findById({
      model: UserModel,
      id: socket.id,
    });

    const receiver = await dbService.findById({
      model: UserModel,
      id: userId,
    });

    const company = await dbService.findById({
      model: CompanyModel,
      id: companyId,
    });

    // Get chat messages between sender & receiver to check if no messages found
    const chatMessages = await dbService.find({
      model: ChatModel,
      filter: {
        $or: [
          { senderId: sender._id, receiverId: receiver._id },
          { senderId: receiver._id, receiverId: sender._id },
        ],
      },
    });

    // Check if the HR is the Message Sender and no message found between sender and receiver
    if (chatMessages.length === 0) {
      if (company.HRs.some((hr) => hr.toString() === sender._id.toString())) {
        // Create new chat message
        const newChat = await dbService.create({
          model: ChatModel,
          data: {
            senderId: sender._id,
            receiverId: receiver._id,
            messages: [{ message, senderId: sender._id, createdAt: now }],
            createdAt: now,
          },
        });
      } else {
        return next(
          new Error("Only HR can starting sending real-time messages")
        );
      }
    } else {
      chatMessages.messages?.push({ message, senderId: sender._id });
      await chat.save();
    }
    socket
      .to(receiver._id)
      .emit("successMessage", { content, from: socket.id });
  };
};
