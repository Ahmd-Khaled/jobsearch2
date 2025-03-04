import mongoose, { Schema, Types, model } from "mongoose";
import {
  jobDescriptionExample,
  jobLocations,
  seniorityLevels,
  workingTimes,
} from "../../utils/variables.js";

const jobSchema = new Schema(
  {
    jobTitle: { type: String, required: true },
    jobLocation: {
      type: String,
      enum: Object.values(jobLocations),
      required: true,
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTimes),
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(seniorityLevels),
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
      example: jobDescriptionExample,
    },
    technicalSkills: [{ type: String }],
    softSkills: [{ type: String }],
    addedBy: { type: Types.ObjectId, ref: "User" },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    closed: { type: Boolean, default: false },
    companyId: { type: Types.ObjectId, ref: "Company" },
    // applicants: [{ type: Types.ObjectId }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Apply pagination
jobSchema.query.paginate = async function (page, limit, filter = {}) {
  // Pagination logic
  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;

  const skip = limit * (page - 1);

  console.log("-----------------------filter---------:", filter);

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

export const JobModel = mongoose.model.Job || model("Job", jobSchema);
