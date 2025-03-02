import { customAlphabet } from "nanoid";
import { generateHash } from "../hashing/hash.js";
import { now, OTP_EXPIRATION } from "../variables.js";

export const generateOTPFn = (length) => {
  const otp = customAlphabet("0123456789", length)();
  const hashedOTP = generateHash({ plainText: otp });
  const expiresAt = new Date(now + OTP_EXPIRATION);

  return { otp, hashedOTP, expiresAt };
};
