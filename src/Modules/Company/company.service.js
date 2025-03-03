import { Types } from "mongoose";
import * as dbService from "../../DB/dbService.js";
import { CompanyModel } from "../../DB/Models/company.model.js";
import cloudinary from "../../utils/file_uploading/cloudinaryConfig.js";
import {
  defaultCoverPic,
  defaultCoverPicPublicId,
  defaultLogo,
  defaultLogoPublicId,
  now,
  roleTypes,
} from "../../utils/variables.js";

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

export const softDeleteCompany = async (req, res, next) => {
  const companyId = req.params.companyId;
  // Check if the logged user is the company owner
  const company = await dbService.findOne({
    model: CompanyModel,
    filter: { CreatedBy: req.user._id },
  });

  // Check if the company is already soft deleted
  if (company.deletedAt) {
    return next(new Error("Company already soft deleted"));
  }

  // Check if req.user.role = "Admin" && the logged user is the company owner
  if (!company && req.user.role !== roleTypes.Admin) {
    return next(
      new Error(
        "Unauthorized to delete this company (only Admin or Company Owner can delete the company)"
      )
    );
  }

  const updatedCompany = await dbService.findByIdAndUpdate({
    model: CompanyModel,
    id: companyId,
    data: { deletedAt: now },
  });

  return res.status(200).json({
    status: true,
    message: "Company soft deleted successfully",
    data: updatedCompany,
  });
};

export const getCompanyById = async (req, res, next) => {
  const companyId = req.params.companyId;
  const company = await dbService.findOne({
    model: CompanyModel,
    filter: { _id: companyId },
  });
  if (!company) {
    return next(new Error("Company not found"));
  }
  return res.status(200).json({
    status: true,
    message: "Company fetched successfully",
    data: company,
  });
};

export const searchCompanyByName = async (req, res, next) => {
  const { page, name } = req.query;

  const searchResults = await dbService.find({
    model: CompanyModel,
    filter: { companyName: { $regex: name, $options: "i" } }, // Search company name with Case Insensitive
    select: "-CreatedBy -legalAttachment -deletedAt",
    populate: [
      {
        path: "CreatedBy",
        select: "firstName lastName email mobileNumber",
      },
    ],
  });

  if (!searchResults || searchResults.data.length === 0) {
    return next(new Error("Company not found"));
  }
  return res.status(200).json({
    status: true,
    message: "Company fetched successfully",
    ...searchResults,
  });
};

export const uploadLogo = async (req, res, next) => {
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

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Companies/${company.companyEmail}/logo`,
    }
  );

  company.logo = { public_id, secure_url };
  await company.save();

  return res.status(200).json({
    status: true,
    message: "Company logo uploaded successfully",
    data: company,
  });
};

export const uploadCoverPic = async (req, res, next) => {
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

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Companies/${company.companyEmail}/coverPic`,
    }
  );

  company.coverPic = { public_id, secure_url };
  await company.save();

  return res.status(200).json({
    status: true,
    message: "Company cover picture uploaded successfully",
    data: company,
  });
};

export const deleteLogo = async (req, res, next) => {
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

  const results = await cloudinary.uploader.destroy(company.logo.public_id);

  if (results.result === "ok") {
    company.logo = {
      public_id: defaultLogoPublicId,
      secure_url: defaultLogo,
    };

    await company.save();
  } else {
    console.error("Error deleting company logo from Cloudinary:", results);
  }

  return res.status(200).json({
    status: true,
    message: "Company logo deleted successfully",
    data: company,
  });
};

export const deleteCoverPic = async (req, res, next) => {
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

  const results = await cloudinary.uploader.destroy(company.coverPic.public_id);

  if (results.result === "ok") {
    company.coverPic = {
      public_id: defaultCoverPicPublicId,
      secure_url: defaultCoverPic,
    };

    await company.save();
  } else {
    console.error("Error deleting company logo from Cloudinary:", results);
  }

  return res.status(200).json({
    status: true,
    message: "Company cover picture deleted successfully",
    data: company,
  });
};
