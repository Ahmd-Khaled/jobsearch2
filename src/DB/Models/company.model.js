import mongoose, { Schema, Types, model } from "mongoose";
import {
  employeesRanges,
  exampleDescription,
  exampleIndustry,
} from "../../utils/variables.js";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minLength: [2, "Company name must be at least 2 characters"],
      maxLength: [40, "Company name cannot exceed 40 characters"],
    },
    description: {
      type: String,
      example: exampleDescription,
      minLength: [10, "Company description must be at least 10 characters"],
      maxLength: [1000, "Company name cannot exceed 1000 characters"],
    },
    industry: { type: String, example: exampleIndustry },
    address: { type: String },
    numberOfEmployees: {
      type: String,
      enum: Object.values(employeesRanges),
    },
    companyEmail: { type: String, unique: true, required: true },
    CreatedBy: { type: Types.ObjectId, ref: "User" },
    Logo: { secure_url: String, public_id: String },
    coverPic: { secure_url: String, public_id: String },
    HRs: [{ type: Types.ObjectId, ref: "User" }],
    bannedAt: { type: Date },
    deletedAt: { type: Date },
    legalAttachment: { secure_url: String, public_id: String },
    approvedByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CompanyModel =
  mongoose.model.Company || model("Company", companySchema);
