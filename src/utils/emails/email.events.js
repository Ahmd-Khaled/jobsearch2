import { EventEmitter } from "events";
import { UserModel } from "../../DB/Models/user.model.js";
import { generateOTPFn } from "../otp/generateOTPFn.js";
import * as dbService from "../../DB/dbService.js";
import { subject, typesOfOTP } from "../variables.js";
import templateEmail from "./templateEmail.js";
import sendEmail from "./sendEmail.js";

export const emailEmitter = new EventEmitter();

emailEmitter.on("registerEvent", async (email, userName, id, OTPList) => {
  await sendCode({
    data: { email, userName, id, OTPList },
    subjectType: subject.register,
  });
});
emailEmitter.on("forgetPasswordEvent", async (email, userName, id, OTPList) => {
  await sendCode({
    data: { email, userName, id, OTPList },
    subjectType: subject.forgotPassword,
  });
});

export const sendCode = async ({ data = {}, subjectType }) => {
  const { email, userName, id, OTPList = [] } = data;
  // Generate OTP
  const { otp, hashedOTP, expiresAt } = generateOTPFn(6);

  let updateData = {};

  switch (subjectType) {
    case subject.register:
      updateData = {
        OTP: [
          {
            code: otp,
            type: typesOfOTP.confirmEmail,
            expiresIn: expiresAt,
          },
        ],
      };
      break;
    case subject.forgotPassword:
      updateData = {
        OTP: [
          {
            code: otp,
            type: typesOfOTP.forgetPassword,
            expiresIn: expiresAt,
          },
        ],
      };
      break;
    default:
      break;
  }

  const user = await dbService.findOne({
    model: UserModel,
    filter: { _id: id },
  });

  user.OTP = updateData.OTP;
  user.markModified("OTP"); // Force Mongoose to detect the OTP change
  await user.save(); // This will trigger the pre("save") middleware

  const isSent = await sendEmail({
    to: email,
    subject: subjectType,
    html: templateEmail(otp, userName, subjectType),
  });
};
