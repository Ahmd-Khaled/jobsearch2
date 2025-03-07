import mongoose, { Schema, Types, model } from "mongoose";
import {
  employeesRanges,
  exampleDescription,
  exampleIndustry,
} from "../../utils/variables.js";
import { deleteRelatedDocumentsPlugin } from "../../utils/deleteRelatedDocumentsPlugin.js";
import { JobModel } from "./job.model.js";

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
    logo: { secure_url: String, public_id: String },
    coverPic: { secure_url: String, public_id: String },
    HRs: [{ type: Types.ObjectId, ref: "User" }],
    bannedAt: { type: Date },
    deletedAt: { type: Date },
    legalAttachment: { secure_url: String, public_id: String },
    approvedByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual populate related company jobs from Job Model
companySchema.virtual("jobs", {
  ref: "Job", // The model to reference
  localField: "_id", // The field in the company schema
  foreignField: "companyId", // The field in the job schema that references the company
});

// Apply pagination
companySchema.query.paginate = async function (page, limit, filter = {}) {
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

companySchema.plugin(deleteRelatedDocumentsPlugin, {
  relatedModels: [{ model: JobModel, field: "companyId" }],
});

export const CompanyModel =
  mongoose.model.Company || model("Company", companySchema);
