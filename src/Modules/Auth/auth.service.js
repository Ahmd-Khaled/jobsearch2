import { OAuth2Client } from "google-auth-library";
import * as dbService from "../../DB/dbService.js";
import { UserModel } from "../../DB/Models/user.model.js";
import { emailEmitter } from "../../utils/emails/email.events.js";
import { decrypt } from "../../utils/encryption/encryption.js";
import cloudinary from "../../utils/file_uploading/cloudinaryConfig.js";
import { compareHash } from "../../utils/hashing/hash.js";
import { access_token, refresh_token } from "../../utils/token/tokens.js";
import {
  now,
  providersTypes,
  roleTypes,
  typesOfOTP,
} from "../../utils/variables.js";

// Register
export const signup = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    gender,
    DOB,
    role,
    mobileNumber,
  } = req.body;

  const user = await dbService.findOne({ model: UserModel, filter: { email } });

  if (user) {
    return next(new Error("Email already exists", { cause: 409 }));
  }

  // Check if profilePic is sent
  let profilePic;
  if (req.files?.profilePic) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.profilePic[0].path,
      {
        folder: `Users/${email}/profilePic`,
      }
    );

    profilePic = { secure_url, public_id };
  }

  // Check if coverPic is sent
  let coverPic;
  if (req.files?.coverPic) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.coverPic[0].path,
      {
        folder: `Users/${email}/coverPic`,
      }
    );

    coverPic = { secure_url, public_id };
  }

  const newUser = await dbService.create({
    model: UserModel,
    data: {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      gender,
      DOB,
      role,
      profilePic,
      coverPic,
      mobileNumber,
    },
  });

  //   Send Verification Email with OTP
  emailEmitter.emit(
    "registerEvent",
    email,
    `${firstName} ${lastName}`,
    newUser?._id,
    newUser?.OTP
  );

  return res.status(201).json({
    status: true,
    message: "User registered successfully, OTP sent successfully",
  });
};

export const confirmOTP = async (req, res, next) => {
  const { email, otp, type } = req.body;

  const user = await dbService.findOne({
    model: UserModel,
    filter: { email },
  });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  if (user.isConfirmed) {
    return next(new Error("Email already verified", { cause: 409 }));
  }

  const checkOTP = user?.OTP?.filter((otp) => otp.type === type);

  if (!checkOTP || checkOTP.length === 0) {
    return next(new Error("OTP type not found", { cause: 400 }));
  }

  if (!compareHash({ plainText: otp, hashedText: checkOTP[0].code })) {
    return next(new Error("Invalid OTP", { cause: 400 }));
  }

  if (checkOTP[0].expiresIn < now) {
    return next(new Error("OTP has expired.", { cause: 400 }));
  }

  const newOTPList = user?.OTP?.filter((otp) => otp.type !== type);
  await dbService.updateOne({
    model: UserModel,
    filter: { email },
    data: { isConfirmed: true, OTP: newOTPList },
  });

  return res.status(200).json({
    status: true,
    message: "Email verified successfully",
  });
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await dbService.findOne({
    model: UserModel,
    filter: { email },
  });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  if (!compareHash({ plainText: password, hashedText: user.password })) {
    return next(new Error("Invalid email or password", { cause: 400 }));
  }

  if (!user.isConfirmed) {
    return next(new Error("Email not verified", { cause: 401 }));
  }
  // Decrypt mobile number
  const mobileNumber = decrypt({
    encryptedText: user.mobileNumber,
    signature: process.env.ENCRYPTION_SECRET,
  });

  user.mobileNumber = mobileNumber;

  return res.status(201).json({
    status: true,
    message: "User signed in successfully",
    tokens: {
      access_token: access_token(user),
      refresh_token: refresh_token(user),
    },
    user,
  });
};

export const signUpGoogle = async (req, res, next) => {
  const { idToken } = req.body;

  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const { sub, name, email, email_verified, picture } = await verify();

  if (!email_verified) {
    return next(new Error("Email at Google not verified", { cause: 401 }));
  }

  let user = await dbService.findOne({
    model: UserModel,
    filter: { email },
  });

  if (
    user?.provider === providersTypes.System ||
    user?.provider === providersTypes.Google
  ) {
    return next(new Error("User already exists", { cause: 409 }));
  }

  if (!user) {
    user = await dbService.create({
      model: UserModel,
      data: {
        email,
        firstName: name,
        profilePic: picture,
        isConfirmed: email_verified,
        provider: providersTypes.Google,
        role: roleTypes.User,
      },
    });
  }

  return res.status(201).json({
    status: true,
    message: "User sgned up with Google successfully",
  });
};

export const signInGoogle = async (req, res, next) => {
  const { idToken } = req.body;

  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const { sub, name, email, email_verified, picture } = await verify();

  if (!email_verified) {
    return next(new Error("Email at Google not verified", { cause: 401 }));
  }

  let user = await dbService.findOne({
    model: UserModel,
    filter: { email },
  });

  if (
    user?.provider === providersTypes.System ||
    user?.provider === providersTypes.Google
  ) {
    return next(new Error("User already exists", { cause: 409 }));
  }

  if (!user) {
    user = await dbService.create({
      model: UserModel,
      data: {
        email,
        firstName: name,
        profilePic: picture,
        isConfirmed: email_verified,
        provider: providersTypes.Google,
        role: roleTypes.User,
      },
    });
  }

  return res.status(201).json({
    status: true,
    message: "User signed in with Google successfully",
    tokens: {
      access_token: access_token(user),
      refresh_token: refresh_token(user),
    },
    user,
  });
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await dbService.findOne({
    model: UserModel,
    filter: { email },
  });

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // Send OTP

  emailEmitter.emit(
    "forgetPasswordEvent",
    email,
    user?.username,
    user?._id,
    user?.OTP
  );

  return res.status(200).json({
    status: true,
    message: "Forget password OTP sent successfully",
  });
};

export const resetPassword = async (req, res, next) => {
  const { email, password, otp } = req.body;

  const user = await dbService.findOne({
    model: UserModel,
    filter: { email },
  });

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const forgetPasswordOTPObj = user.OTP.filter(
    (otp) => otp.type === typesOfOTP.forgetPassword
  );
  if (!forgetPasswordOTPObj || forgetPasswordOTPObj.length === 0) {
    return next(new Error("Forget password OTP not found", { cause: 400 }));
  }
  if (
    !compareHash({
      plainText: otp,
      hashedText: forgetPasswordOTPObj[0].code,
    })
  ) {
    return next(new Error("Invalid OTP", { cause: 400 }));
  }

  if (forgetPasswordOTPObj[0].expiresIn < now) {
    return next(new Error("OTP has expired.", { cause: 400 }));
  }

  user.changeCredentialTime = now;
  user.password = password;
  user.OTP = [];
  user.markModified("password"); // Force Mongoose to detect the password change
  await user.save(); // This will trigger the pre("save") middleware

  return res.status(200).json({
    status: true,
    message: "Password reset successfully",
  });
};

export const refreshToken = async (req, res, next) => {
  return res.status(201).json({
    status: true,
    message: "User signed in successfully",
    tokens: {
      access_token: access_token(req.user),
      refresh_token: refresh_token(req.user),
    },
    user: req.user,
  });
};
