import mongoose, { Schema, Types, model } from "mongoose";

const chatSchema = new Schema(
  {
    senderId: { type: Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Types.ObjectId, ref: "User", required: true },
    messages: [
      {
        message: String,
        senderId: { type: Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model.Chat || model("Chat", chatSchema);
