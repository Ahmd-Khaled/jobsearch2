import * as dbService from "../../DB/dbService.js";
import { UserModel } from "../../DB/Models/user.model.js";
import cloudinary from "../../utils/file_uploading/cloudinaryConfig.js";
import { compareHash } from "../../utils/hashing/hash.js";
import {
  defaultCoverPic,
  defaultCoverPicPublicId,
  defaultProfilePic,
  defaultProfilePicPublicId,
  now,
  roleTypes,
} from "../../utils/variables.js";

export const updateUser = async (req, res, next) => {
  const { firstName, lastName, gender, DOB, mobileNumber } = req.body;

  const user = await dbService.findOne({
    model: UserModel,
    filter: { _id: req.user._id },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.firstName = firstName;
  user.lastName = lastName;
  user.gender = gender;
  user.DOB = DOB;
  user.mobileNumber = mobileNumber;
  user.markModified("mobileNumber"); // Force Mongoose to detect the mobileNumber change

  await user.save();
  res
    .status(200)
    .json({ status: true, message: "User updated successfully", user });
};

export const getLoggedUserData = async (req, res, next) => {
  const user = await dbService.findOne({
    model: UserModel,
    filter: { _id: req.user._id },
    select: "-password -isConfirmed -OTP", // Exclude  password,isConfirmed, OTP from response
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res
    .status(200)
    .json({ status: true, message: "User data fetched successfully", user });
};

export const getUserProfileData = async (req, res, next) => {
  const userId = req.params.userId;
  const user = await dbService.findOne({
    model: UserModel,
    filter: { _id: userId },
    select: "username firstName lastName mobileNumber profilePic coverPic",
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({
    status: true,
    message: "User profile data fetched successfully",
    user,
  });
};

export const updatPassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (
    !compareHash({
      plainText: currentPassword,
      hashedText: req.user.password,
    })
  ) {
    return next(new Error("Invalid Current Password", { cause: 401 }));
  }

  const user = await dbService.findOne({
    model: UserModel,
    filter: { _id: req.user._id },
  });

  user.password = newPassword;
  user.changeCredentialTime = now;

  user.markModified("password"); // Force Mongoose to detect the password change
  await user.save(); // This will trigger the pre("save") middleware

  res
    .status(200)
    .json({ status: true, message: "Password updated successfully" });
};

export const uploadProfilePic = async (req, res, next) => {
  const user = await dbService.findById({
    model: UserModel,
    id: { _id: req.user._id },
  });

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Users/${user.email}/profilePic`,
    }
  );

  user.profilePic = { public_id, secure_url };
  await user.save();

  return res.status(200).json({
    status: true,
    message: "Profile Picture uploaded successfully",
    data: user,
  });
};

export const uploadCoverPic = async (req, res, next) => {
  const user = await dbService.findById({
    model: UserModel,
    id: { _id: req.user._id },
  });

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Users/${user.email}/coverPic`,
    }
  );

  user.coverPic = { public_id, secure_url };
  await user.save();

  return res.status(200).json({
    status: true,
    message: "Cover Picture uploaded successfully",
    data: user,
  });
};

export const deleteProfilePic = async (req, res, next) => {
  const user = await dbService.findById({
    model: UserModel,
    id: { _id: req.user._id },
  });

  const results = await cloudinary.uploader.destroy(user.profilePic.public_id);

  if (results.result === "ok") {
    user.profilePic = {
      public_id: defaultProfilePicPublicId,
      secure_url: defaultProfilePic,
    };
    await user.save();
  } else {
    console.error("Error deleting profile picture from Cloudinary:", results);
  }

  return res.status(200).json({
    status: true,
    message: "Profile picture deleted successfully",
    data: user,
  });
};

export const deleteCoverPic = async (req, res, next) => {
  const user = await dbService.findById({
    model: UserModel,
    id: { _id: req.user._id },
  });

  const results = await cloudinary.uploader.destroy(user.coverPic.public_id);

  if (results.result === "ok") {
    user.coverPic = {
      public_id: defaultCoverPicPublicId,
      secure_url: defaultCoverPic,
    };
    await user.save();
  } else {
    console.error("Error deleting cover picture from Cloudinary:", results);
  }

  return res.status(200).json({
    status: true,
    message: "Cover picture deleted successfully",
    data: user,
  });
};

export const softDeleteAccount = async (req, res, next) => {
  const userId = req.params.userId;

  const user = await dbService.findById({
    model: UserModel,
    id: { _id: userId },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the user account is already soft deleted
  if (user.deletedAt) {
    return next(new Error("User account already soft deleted"));
  }

  user.deletedAt = now;
  await user.save();

  res.status(200).json({
    status: true,
    message: "User account soft deleted successfully",
  });
};

// Get all users (role=user)
export const getAllUsers = async (req, res, next) => {
  const users = await dbService.findWithoutPaginate({
    model: UserModel,
    filter: { role: roleTypes.User },
    sort: { createdAt: -1 }, // Sort by createdAt in descending order
  });
  if (!users) {
    return res.status(404).json({ message: "No users found" });
  }

  res.status(200).json({
    status: true,
    message: "Users fetched successfully",
    data: users,
  });
};
