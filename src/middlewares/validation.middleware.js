import Joi from "joi";
import { Types } from "mongoose";
import { genderTypes, roleTypes, typesOfOTP } from "../utils/variables.js";

export const isValidObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value) ? true : helper.message("Invalid Id");
};

export const generalField = {
  id: Joi.string().custom(isValidObjectId),
  firstName: Joi.string().min(3).max(30),
  lastName: Joi.string().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  gender: Joi.string().valid(...Object.values(genderTypes)),
  DOB: Joi.date()
    .iso()
    .less("now")
    .custom((value, helpers) => {
      const age = new Date().getFullYear() - value.getFullYear();
      if (age < 18) {
        return helpers.error("Age must be greater than 18 years");
      }
      return value;
    }),
  role: Joi.string().valid(...Object.values(roleTypes)),
  otpType: Joi.string().valid(...Object.values(typesOfOTP)),
  otp: Joi.string(),
  password: Joi.string().pattern(
    new RegExp(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
    )
  ),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
  confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")),
  email: Joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  mobileNumber: Joi.string().pattern(
    new RegExp(/^(002|\+2)?01[012456][0-9]{8}$/)
  ),
  fileObject: {
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    buffer: Joi.number(),
  },
};

export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    if (req.file || req.files?.length) {
      data.file = req.file || req.files;
    }
    const results = schema.validate(data, { abortEarly: false });

    // console.log("--------------------------- results:", results);
    if (results.error) {
      const errorMessages = results.error?.details?.map((obj) => {
        obj.message;
      });
      return next(new Error(results?.error, { cause: 400 }));
    }
    return next();
  };
};
