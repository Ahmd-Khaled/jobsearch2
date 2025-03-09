import jwt from "jsonwebtoken";

export const generateToken = ({ payload, signature, options = {} }) => {
  return jwt.sign(payload, signature, options);
};

export const verifyToken = ({ token, signature, options = {} }) => {
  try {
    return jwt.verify(token, signature, options);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { expired: true };
    }
    throw error;
  }
};
