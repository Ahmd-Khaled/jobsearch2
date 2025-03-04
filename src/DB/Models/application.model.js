import mongoose, { Schema, Types, model } from "mongoose";
import { appsStatus } from "../../utils/variables.js";

const applicationSchema = new Schema(
  {
    jobId: { type: Types.ObjectId, ref: "Job", required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    userCV: { secure_url: String, public_id: String },
    status: {
      type: String,
      enum: Object.values(appsStatus),
      default: appsStatus.pending,
    },
  },
  { timestamps: true }
);

// Apply pagination
applicationSchema.query.paginate = async function (page, limit, filter = {}) {
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

export const ApplicationModel =
  mongoose.model.Application || model("Application", applicationSchema);
