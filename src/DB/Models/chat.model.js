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

chatSchema.query.paginate = async function (page, limit, filter = {}) {
  // Pagination logic
  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;

  const skip = limit * (page - 1);

  // this here (as a query) equal to = await PostModel.find()
  const data = await this.skip(skip).limit(limit);

  // countDocoment work only in the Model but this here act as a query so we will use this.model
  const items = await this.model.countDocuments(filter);
  const totalPages = Math.ceil(items / limit);
  return {
    data,
    totalItems: items,
    currentPage: page,
    totalPages,
    itemsPerPage: data.length,
    nextPage: page < totalPages ? page + 1 : "",
    previousPage: page > 1 ? page - 1 : "",
    lastPage: totalPages,
  };
};

export const ChatModel = mongoose.model.Chat || model("Chat", chatSchema);
