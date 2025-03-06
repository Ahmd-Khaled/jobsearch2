import * as dbService from "../../DB/dbService.js";
import { ApplicationModel } from "../../DB/Models/application.model.js";
import { CompanyModel } from "../../DB/Models/company.model.js";
import { JobModel } from "../../DB/Models/job.model.js";
import { emailEmitter } from "../../utils/emails/email.events.js";
import cloudinary from "../../utils/file_uploading/cloudinaryConfig.js";
import { appsStatus } from "../../utils/variables.js";

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

  //   ensure that only the job owner can update the job
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

// Get All Jobs Related To Comapny or Specific Job
export const getJobsForCompany = async (req, res, next) => {
  const companyId = req.params.companyId;
  let { page, limit, search, sort, jobId } = req.query;

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

  //   If User search for specific job by jobId for specific company
  if (jobId) {
    const jobs = await dbService.find({
      model: JobModel,
      filter: {
        companyId: query.company,
        _id: jobId,
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
      resource_type: "raw", // Important for PDF or any non-image file
      folder: `Companies/${company?.companyEmail}/Jobs/${jobId}/CVs`,
      public_id: `${req.user._id}.pdf`, //  Add the filename + extension
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

  //  Emit a socket event to notify each HR in the company HRs list
  //  that a new application has been submitted
  company?.HRs?.forEach((hr) => {
    if (hr) {
      req.app
        .get("socket")
        .to(hr)
        .emit("newApplication", {
          message: `New Application for ${job.title}`,
          jobId,
          userId: req.user._id,
          companyId: job.companyId,
        });
    }
  });

  req.app.get("socket").emit("newApplication", {
    message: `A new application has been submitted for job: ${job.title}`,
    jobId,
    userId: req.user._id,
    companyId: job.companyId,
  });

  return res.status(200).json({
    status: true,
    message: "Application submitted successfully",
    data: newApplication,
  });
};

// Get all applications for specific Job.
export const getAllJobApplications = async (req, res, next) => {
  const jobId = req.params.jobId;
  let { page, limit, sort } = req.query;

  const job = await dbService.findById({
    model: JobModel,
    id: jobId,
  });

  if (!job) {
    return next(new Error("Job not found"));
  }

  //   Get Comapny related to the Job to get its HRs
  const company = await dbService.findById({
    model: CompanyModel,
    id: job.companyId,
  });

  if (!company) {
    return next(new Error("Company not found"));
  }

  //   Ensure that each company Owner or company hr can take a look at the applications
  if (
    !company.HRs.some((hr) => hr.toString() === req.user._id.toString()) &&
    job.addedBy.toString() !== req.user._id.toString()
  ) {
    return next(
      new Error(
        "Unauthorized to view job applications (only company Owner or company HRs can view the job applications)"
      )
    );
  }
  //   Get all applications related to the job
  const applications = await dbService.find({
    model: ApplicationModel,
    filter: { jobId },
    limit,
    page,
    sort,
    populate: {
      path: "userId",
      select:
        "-OTP -provider -password -role -isConfirmed -changeCredentialTime",
    },
  });

  if (!applications || applications.data?.length === 0) {
    return next(new Error("No applications found for this job"), {
      cause: 401,
    });
  }
  return res.status(200).json({
    status: true,
    message: "Applications fetched successfully",
    ...applications,
  });
};

// Change Application Status (accepted, viewed, in consideration, rejected)
export const changeApplicationStatus = async (req, res, next) => {
  const applicationId = req.params.applicationId;
  const { status } = req.body;

  const application = await dbService.findById({
    model: ApplicationModel,
    id: applicationId,
    populate: {
      path: "jobId",
      populate: {
        path: "companyId", // Nested Populate, This will populate company from the populated job
      },
    },
  });

  if (!application) {
    return next(new Error("Application not found"));
  }

  //   console.log("-----------------------application:", application);

  //   Ensure that each company Owner or company hr can change the application status
  if (
    !application.jobId.companyId.HRs.some(
      (hr) => hr.toString() === req.user._id.toString()
    ) &&
    application.jobId.addedBy.toString() === req.user._id.toString()
  ) {
    return next(
      new Error(
        "Unauthorized to change application status (only company Owner or company HRs can change the status)"
      )
    );
  }

  //   If the application is accepted, send an acceptance email to the applicant.
  //   If the application is rejected, send an rejection email to the applicant
  if (status === appsStatus.accepted || status === appsStatus.rejected) {
    // Send acceptance | rejection email to applicant
    emailEmitter.emit(
      "changeStatus",
      req.user.email,
      `${req.user.firstName} ${req.user.lastName}`,
      status,
      application.jobId.jobTitle
    );
  }

  application.status = status;
  await application.save();
  return res.status(200).json({
    status: true,
    message: `Application status updated successfully (${status})`,
  });
};
