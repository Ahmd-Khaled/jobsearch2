import { Types } from "mongoose";
import * as dbService from "../../DB/dbService.js";
import { CompanyModel } from "../../DB/Models/company.model.js";
import cloudinary from "../../utils/file_uploading/cloudinaryConfig.js";

// Register
export const addCompany = async (req, res, next) => {
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    HRs,
  } = req.body;

  const company = await dbService.findOne({
    model: CompanyModel,
    filter: { companyEmail, companyName },
  });

  if (company) {
    return next(new Error("Company already exists"));
  }

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Companies/${companyEmail}/legalAttachment`,
    }
  );

  const newCompany = await dbService.create({
    model: CompanyModel,
    data: {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      HRs,
      CreatedBy: req.user._id,
      legalAttachment: { public_id, secure_url },
    },
  });

  return res.status(201).json({
    status: true,
    message: "Company created successfully",
    data: newCompany,
  });
};

export const updateCompany = async (req, res, next) => {
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    HRs,
  } = req.body;

  const company = await dbService.findOne({
    model: CompanyModel,
    filter: { CreatedBy: req.user._id },
  });

  if (!company) {
    return next(
      new Error(
        "Company not found or unauthorized to update this company (only company owner)"
      )
    );
  }

  let newHRsList = company.HRs; // Always assign existing HRs

  // Update HRs list if sent and remove duplicate IDs
  if (Array.isArray(HRs) && HRs.length > 0) {
    company.HRs = [
      ...new Set([...company.HRs, ...HRs].map((hr) => hr.toString())),
    ].map((hr) => Types.ObjectId.createFromHexString(hr)); // convert  ObjectId to string to compare and then convert the string to objectId
    newHRsList = company.HRs;
  }

  const updatedCompany = await dbService.findOneAndUpdate({
    model: CompanyModel,
    filter: { _id: company._id },
    data: {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      HRs: newHRsList,
    },
    options: { returnDocument: "after" }, //  This will return the updated document
  });

  return res.status(200).json({
    status: true,
    message: "Company updated successfully",
    data: updatedCompany,
  });
};
