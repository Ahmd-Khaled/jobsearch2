import * as dbService from "../../DB/dbService.js";
import { CompanyModel } from "../../DB/Models/company.model.js";
import { JobModel } from "../../DB/Models/job.model.js";

// Add Job
export const addJob = async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    closed,
    companyId,
  } = req.body;

  const company = await dbService.findById({
    model: CompanyModel,
    id: companyId,
  });

  if (!company) {
    return next(new Error("Company not found"));
  }

  // Check if logged user is one of company HRs or company owner
  if (
    !company.HRs.some((hr) => hr.toString() === req.user._id.toString()) &&
    company.CreatedBy.toString() !== req.user._id.toString()
  ) {
    return next(
      new Error(
        "Unauthorized to add a job (only company HR or Company Owner can add a job)"
      )
    );
  }

  const newJob = await dbService.create({
    model: JobModel,
    data: {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      closed,
      companyId,
      addedBy: req.user._id,
    },
  });

  return res.status(201).json({
    status: true,
    message: "Job added successfully",
    data: newJob,
  });
};

// Update Job
export const updateJob = async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    closed,
  } = req.body;

  const jobId = req.params.jobId;

  const job = await dbService.findById({
    model: JobModel,
    id: jobId,
  });
  if (!job) {
    return next(new Error("Job not found"));
  }

  //   ensure that only the owner can update the job
  if (job.addedBy.toString() !== req.user._id.toString()) {
    return next(
      new Error(
        "Unauthorized to update this job (only job creator can update the job)"
      )
    );
  }
  const updatedJob = await dbService.updateOne({
    model: JobModel,
    filter: { _id: jobId },
    data: {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      closed,
      updatedBy: req.user._id,
    },
  });

  return res.status(200).json({
    status: true,
    message: "Job updated successfully",
    data: updatedJob,
  });
};

// Delete a job
export const deleteJob = async (req, res, next) => {
  const jobId = req.params.jobId;

  const job = await dbService.findById({
    model: JobModel,
    id: jobId,
  });

  if (!job) {
    return next(new Error("Job not found"));
  }

  const company = await dbService.findById({
    model: CompanyModel,
    id: job.companyId,
  });

  //   ensure that only the company HR related to the job company can delete the job
  if (!company.HRs.some((hr) => hr.toString() === req.user._id.toString())) {
    return next(
      new Error(
        "Unauthorized to delete this job (only company HR can delete the job)"
      )
    );
  }

  await dbService.deleteOne({
    model: JobModel,
    filter: { _id: jobId },
  });

  return res.status(200).json({
    status: true,
    message: "Job deleted successfully",
  });
};

// Get All Jobs Related To Comapny
export const getJobsForCompany = async (req, res, next) => {
  const companyId = req.params.companyId;
  let { page, limit, search, sort } = req.query;
  const { jobId } = req.body;

  let query = { company: companyId };

  //   Check if user search for a comapny jobs by comapny name
  if (search) {
    const company = await dbService.findOne({
      model: CompanyModel,
      filter: { companyName: { $regex: search, $options: "i" } }, // Search company name with Case Insensitive
    });

    if (company) {
      query.company = company._id;
    } else {
      return next(new Error("Company not found"), { cause: 404 });
    }
  }

  //   Find all jobs related the the query (cpmanyId)
  const jobs = await dbService.find({
    model: JobModel,
    filter: { companyId: query.company },
    limit: limit,
    page: page,
    sort,
    populate: { path: "companyId", select: "companyName industry" },
  });

  if (!jobs || jobs.data?.length === 0) {
    return next(new Error("No jobs found for this comapny"), { cause: 401 });
  }

  return res.status(200).json({
    status: true,
    message: "Jobs fetched successfully",
    ...jobs,
  });
};
