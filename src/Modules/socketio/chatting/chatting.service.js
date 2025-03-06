import * as dbService from "../../../DB/dbService.js";
import { ChatModel } from "../../../DB/Models/chat.model.js";
import { CompanyModel } from "../../../DB/Models/company.model.js";
import { UserModel } from "../../../DB/Models/user.model.js";
import { now } from "../../../utils/variables.js";

// The frontend can listen for the "chatStarted" event to enable the message input.
// If no "chatStarted" event is received, the user won't be able to send messages.
export const startChat = function (socket, io) {
  return async ({ senderId, receiverId, companyId }) => {
    try {
      // Check the receiver user
      const receiver = await dbService.findById({
        model: UserModel,
        id: receiverId,
      });
      if (!receiver) {
        return socket.emit("error", { message: "Reciver user not found" });
      }

      // Get the company to compare its HRs with the senderId
      const company = await dbService.findById({
        model: CompanyModel,
        id: companyId,
      });

      // Check if the HR is the Message Sender
      if (!company.HRs.some((hr) => hr.toString() === senderId.toString())) {
        return io.to(receiverId).emit("error", "Unauthorized to start chat");
      }

      // Create a unique room for sender & receiver, This ensures that only these two users will receive messages.
      socket.join(`${senderId}-${receiverId}`);

      // Allow chating by emitting "chatStarted" event to the frontend
      socket.emit("chatStarted", {
        message: "Chat started successfully",
        senderId: receiverId,
        receiverId: senderId,
      });
    } catch (error) {
      console.log("Start Chat Error: ", error);
      socket.emit("error", { message: "Failed to start chat" });
    }
  };
};

export const sendMessage = function (socket, io) {
  return async ({ senderId, receiverId, message }) => {
    try {
      // Check if the message is empty
      if (!message.trim()) {
        return socket.emit("error", { message: "Message can not be empty" });
      }
      // Check the receiver user
      const receiver = await dbService.findById({
        model: UserModel,
        id: receiverId,
      });
      if (!receiver) {
        return socket.emit("error", { message: "Reciver user not found" });
      }
      //   Check if there is chat messages
      const chat = await dbService.findOne({
        model: ChatModel,
        filter: {
          $or: [
            { senderId: senderId, receiverId: receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
      });
      //   console.log("........................ Chat:", chat);
      if (!chat) {
        await dbService.create({
          model: ChatModel,
          data: {
            senderId,
            receiverId,
            messages: [{ message, senderId, createdAt: now }],
          },
        });
      } else {
        // Find & Update chat messages
        await dbService.findOneAndUpdate({
          model: ChatModel,
          filter: {
            $or: [
              { senderId: senderId, receiverId: receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          },
          data: { $push: { messages: { message, senderId, createdAt: now } } },
        });
      }

      // Emitting "receiveMessage" event to the previos created chat room
      // with last message created in the messages list
      io.to(`${senderId}-${receiverId}`).emit("receiveMessage", {
        message: chat?.messages[chat?.messages.length - 1],
        senderId,
        receiverId,
      });
    } catch (error) {
      console.log("Send Message Error: ", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  };
};
