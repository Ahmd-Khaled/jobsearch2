import * as dbService from "../../DB/dbService.js";
import { ApplicationModel } from "../../DB/Models/application.model.js";
import { CompanyModel } from "../../DB/Models/company.model.js";
import { JobModel } from "../../DB/Models/job.model.js";
import cloudinary from "../../utils/file_uploading/cloudinaryConfig.js";

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
  let { page, limit, search, sort, jobTitle } = req.query;

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

  //   If User search for specific job title for specific company
  if (jobTitle) {
    const jobs = await dbService.find({
      model: JobModel,
      filter: {
        companyId: query.company,
        jobTitle: { $regex: jobTitle, $options: "i" },
      },
    });
    if (!jobs) {
      return next(new Error("Job not found"), { cause: 404 });
    }

    return res.status(200).json({
      status: true,
      message: "Job fetched successfully",
      ...jobs,
    });
  }

  //   Find all jobs related the the query (cpmanyId)
  const jobs = await dbService.find({
    model: JobModel,
    filter: {
      companyId: query.company,
    },
    limit,
    page,
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

// Get All Jobs with filters
export const getAllJobs = async (req, res, next) => {
  let {
    page,
    limit,
    sort,
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    technicalSkills,
  } = req.query;

  // Build filter object dynamically to make all filters optional
  let filter = {};

  if (jobTitle) {
    filter.jobTitle = { $regex: jobTitle, $options: "i" };
  }
  if (jobLocation) {
    filter.jobLocation = { $regex: jobLocation, $options: "i" };
  }
  if (workingTime) {
    filter.workingTime = { $regex: workingTime, $options: "i" };
  }
  if (seniorityLevel) {
    filter.seniorityLevel = { $regex: seniorityLevel, $options: "i" };
  }
  if (technicalSkills) {
    filter.technicalSkills = { $regex: technicalSkills, $options: "i" };
  }

  //   Find all jobs with optional filters
  const jobs = await dbService.find({
    model: JobModel,
    filter,
    limit,
    page,
    sort,
    populate: { path: "companyId", select: "companyName industry" },
  });

  if (!jobs || jobs.data?.length === 0) {
    return next(new Error("No jobs found for this filter"), { cause: 401 });
  }

  return res.status(200).json({
    status: true,
    message: "Jobs fetched successfully",
    ...jobs,
  });
};

// Apply to Job
export const applyToJob = async (req, res, next) => {
  const jobId = req.params.jobId;

  const job = await dbService.findById({
    model: JobModel,
    id: jobId,
  });

  if (!job) {
    return next(new Error("Job not found"));
  }
  if (job.closed) {
    return next(new Error("Job is closed"));
  }
  //   Check if User is already applied to the job
  //   Get Application related to the JobId
  const application = await dbService.findOne({
    model: ApplicationModel,
    filter: {
      jobId,
      userId: req.user._id,
    },
  });
  if (application) {
    return next(new Error("You have already applied to this job"));
  }

  //   Get Company related to the Job to save CVs to its folder
  const company = await dbService.findById({
    model: CompanyModel,
    id: job.companyId,
  });

  //   Upload CV(PDF) to cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Companies/${company?.companyEmail}/Jobs/${jobId}/CVs`,
    }
  );

  //  Create a new job application
  const newApplication = await dbService.create({
    model: ApplicationModel,
    data: {
      userId: req.user._id,
      jobId,
      userCV: { public_id, secure_url },
    },
  });

  return res.status(200).json({
    status: true,
    message: "Application submitted successfully",
    data: newApplication,
  });
};
