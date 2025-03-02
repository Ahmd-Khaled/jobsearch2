import { roleTypes } from "../variables.js";
import { generateToken } from "./token.js";

export const access_token = (user) => {
  return generateToken({
    payload: { id: user._id },
    signature:
      user.role === roleTypes?.User
        ? process.env.USER_ACCESS_TOKEN
        : process.env.ADMIN_ACCESS_TOKEN,
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES },
  });
};

export const refresh_token = (user) => {
  return generateToken({
    payload: { id: user._id },
    signature:
      user.role === roleTypes?.User
        ? process.env.USER_REFRESH_TOKEN
        : process.env.ADMIN_REFRESH_TOKEN,
    options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRES },
  });
};
