import mongoose, { Schema, Types, model } from "mongoose";
import { generateHash } from "../../utils/hashing/hash.js";
import {
  genderTypes,
  providersTypes,
  roleTypes,
  typesOfOTP,
} from "../../utils/variables.js";
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import { deleteRelatedDocumentsPlugin } from "../../utils/deleteRelatedDocumentsPlugin.js";
import { ApplicationModel } from "./application.model.js";
import { ChatModel } from "./chat.model.js";
import { CompanyModel } from "./company.model.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      minLength: [3, "First name must be at least 3 characters"],
      maxLength: [30, "First name cannot exceed 30 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      minLength: [3, "Last name must be at least 3 characters"],
      maxLength: [30, "Last name cannot exceed 30 characters"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String },
    provider: {
      type: String,
      trim: true,
      enum: Object.values(providersTypes),
      default: providersTypes.System,
    },
    gender: {
      type: String,
      enum: Object.values(genderTypes),
    },
    DOB: {
      type: Date,
      validate: {
        validator: function (value) {
          const age = Math.floor(
            (Date.now() - value.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
          );
          return age > 18;
        },
        message: "Age must be greater than 18 years",
      },
    },
    mobileNumber: { type: String },
    role: {
      type: String,
      enum: Object.values(roleTypes),
      default: roleTypes.User,
    },
    isConfirmed: { type: Boolean, default: false },
    deletedAt: { type: Date },
    bannedAt: { type: Date },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    changeCredentialTime: { type: Date },
    profilePic: { secure_url: String, public_id: String },
    coverPic: { secure_url: String, public_id: String },
    OTP: [
      {
        code: String,
        type: { type: String, enum: Object.values(typesOfOTP) },
        expiresIn: Date,
      },
    ],
  },

  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = generateHash({ plainText: this.password });
  }

  if (this.isModified("OTP") && Array.isArray(this.OTP) && this.OTP.length) {
    this.OTP = this.OTP.map((otp) => {
      if (otp.code) {
        otp.code = generateHash({ plainText: otp.code });
      }
      return otp;
    });
  }

  if (this.isModified("mobileNumber")) {
    this.mobileNumber = encrypt({
      plainText: this.mobileNumber,
      signature: process.env.ENCRYPTION_SECRET,
    });
  }
  return next();
});

userSchema.post("init", function (doc) {
  if (doc.mobileNumber) {
    try {
      doc.mobileNumber = decrypt({
        encryptedText: doc.mobileNumber,
        signature: process.env.ENCRYPTION_SECRET,
      });
    } catch (err) {
      console.error("Decryption failed", err);
    }
  }
});

userSchema.plugin(deleteRelatedDocumentsPlugin, {
  relatedModels: [
    { model: ApplicationModel, field: "userId" },
    { model: ChatModel, field: "senderId" },
    { model: ChatModel, field: "receiverId" },
    { model: CompanyModel, field: "CreatedBy" },
  ],
});

export const UserModel = mongoose.model.User || model("User", userSchema);
