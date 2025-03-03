import * as dbService from "../../DB/dbService.js";
import { CompanyModel } from "../../DB/Models/company.model.js";
import { JobModel } from "../../DB/Models/job.model.js";

// Register
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
