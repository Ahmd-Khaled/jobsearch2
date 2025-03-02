import * as dbService from "../../DB/dbService.js";
import { UserModel } from "../../DB/Models/user.model.js";

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
