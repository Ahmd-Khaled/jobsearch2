import * as dbService from "../../DB/dbService.js";
import { CompanyModel } from "../../DB/Models/company.model.js";
import { UserModel } from "../../DB/Models/user.model.js";
import { now } from "../../utils/variables.js";

// Ban - UnBan User
export const banUnBanUser = async (req, res, next) => {
  const userId = req.params.userId;

  const user = await dbService.findById({
    model: UserModel,
    id: userId,
  });

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  //   Assign bannedAt Date
  if (user.bannedAt) {
    await dbService.updateOne({
      model: UserModel,
      filter: { _id: userId },
      data: {
        updatedBy: req.user._id,
        $unset: { bannedAt: "" },
      },
    });
    res
      .status(200)
      .json({ status: true, message: "User unbanned successfully" });
  } else {
    await dbService.updateOne({
      model: UserModel,
      filter: { _id: userId },
      data: {
        updatedBy: req.user._id,
        bannedAt: now,
      },
    });
    res.status(200).json({ status: true, message: "User banned successfully" });
  }
};

// Ban - UnBan Company
export const banUnBanCompany = async (req, res, next) => {
  const companyId = req.params.companyId;

  const company = await dbService.findById({
    model: CompanyModel,
    id: companyId,
  });

  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }

  //   Assign bannedAt Date
  if (company.bannedAt) {
    await dbService.updateOne({
      model: CompanyModel,
      filter: { _id: companyId },
      data: {
        $unset: { bannedAt: "" },
      },
    });
    res
      .status(200)
      .json({ status: true, message: "Company unbanned successfully" });
  } else {
    await dbService.updateOne({
      model: CompanyModel,
      filter: { _id: companyId },
      data: {
        bannedAt: now,
      },
    });
    res
      .status(200)
      .json({ status: true, message: "Company banned successfully" });
  }
};

// Approve Company
export const approveCompany = async (req, res, next) => {
  const companyId = req.params.companyId;

  const company = await dbService.findById({
    model: CompanyModel,
    id: companyId,
  });

  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }

  if (company.approvedByAdmin) {
    return next(new Error("Company is already approved", { cause: 409 }));
  }

  company.approvedByAdmin = true;
  await company.save();

  res
    .status(200)
    .json({ status: true, message: "Company approved successfully" });
};
