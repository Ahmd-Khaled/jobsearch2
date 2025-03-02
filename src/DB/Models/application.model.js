import mongoose, { Schema, Types, model } from "mongoose";
import { appsStatus } from "../../utils/variables";

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

export const ApplicationModel =
  mongoose.model.Application || model("Application", applicationSchema);
