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
  },
  { timestamps: true }
);

export const JobModel = mongoose.model.Job || model("Job", jobSchema);
