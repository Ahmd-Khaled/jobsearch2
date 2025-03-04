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
  jobTitle: generalField.text,
  page: generalField.page,
  limit: generalField.number,
  search: generalField.text,
  sort: generalField.text,
}).required();

export const getAllJobsSchema = Joi.object({
  workingTime: generalField.workingTime,
  jobLocation: generalField.jobLocation,
  seniorityLevel: generalField.seniorityLevel,
  jobTitle: generalField.text,
  technicalSkills: generalField.text,
  page: generalField.page,
  limit: generalField.number,
  search: generalField.text,
  sort: generalField.text,
});

export const applyToJobSchema = Joi.object({
  jobId: generalField.id.required(),
  file: Joi.object(generalField.fileObject),
}).required();

export const getAllJobApplicationsSchema = Joi.object({
  jobId: generalField.id.required(),
  page: generalField.page,
  limit: generalField.number,
  sort: generalField.text,
}).required();

export const changeApplicationStatusSchema = Joi.object({
  applicationId: generalField.id.required(),
  status: generalField.status.required(),
}).required();
