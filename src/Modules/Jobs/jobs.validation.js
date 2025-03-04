import Joi from "joi";

import { generalField } from "../../middlewares/validation.middleware.js";

export const addJobSchema = Joi.object({
  companyId: generalField.id.required(),
  jobTitle: generalField.jobTitle.required(),
  jobLocation: generalField.jobLocation.required(),
  workingTime: generalField.workingTime.required(),
  seniorityLevel: generalField.seniorityLevel.required(),
  jobDescription: generalField.jobDescription.required(),
  technicalSkills: generalField.technicalSkills.required(),
  softSkills: generalField.softSkills,
  closed: generalField.boolean,
}).required();

export const updateJobSchema = Joi.object({
  jobId: generalField.id.required(),
  jobTitle: generalField.jobTitle,
  jobLocation: generalField.jobLocation,
  workingTime: generalField.workingTime,
  seniorityLevel: generalField.seniorityLevel,
  jobDescription: generalField.jobDescription,
  technicalSkills: generalField.technicalSkills,
  softSkills: generalField.softSkills,
  closed: generalField.boolean,
}).required();

export const deleteJobSchema = Joi.object({
  jobId: generalField.id.required(),
}).required();

export const getJobsForCompanySchema = Joi.object({
  companyId: generalField.id.required(),
  jobId: generalField.id,
  page: generalField.page,
  limit: generalField.number,
  search: generalField.text,
  sort: generalField.text,
}).required();
