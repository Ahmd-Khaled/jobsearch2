import { asyncHandler } from "../utils/error_handling/asyncHandler.js";
import { verifyToken } from "../utils/token/token.js";
import * as dbService from "../DB/dbService.js";
import { UserModel } from "../DB/Models/user.model.js";
export const tokenTypes = {
  access: "access",
  refresh: "refresh",
};

export const decodedToken = async ({
  authorization = "",
  tokenType = tokenTypes.access,
  next = {},
}) => {
  const [bearer, token] = authorization.split(" ") || [];
  if (!bearer || !token) {
    return next(new Error("Invalid token", { cause: 401 }));
  }

  let ACCESS_SIGNATURE = undefined;
  let REFRESH_SIGNATURE = undefined;

  switch (bearer) {
    case "Admin":
      ACCESS_SIGNATURE = process.env.ADMIN_ACCESS_TOKEN;
      REFRESH_SIGNATURE = process.env.ADMIN_REFRESH_TOKEN;

      break;
    case "User":
      ACCESS_SIGNATURE = process.env.USER_ACCESS_TOKEN;
      REFRESH_SIGNATURE = process.env.USER_REFRESH_TOKEN;
      break;
    default:
      break;
  }

  const decoded = verifyToken({
    token,
    signature:
      tokenType === tokenTypes.access ? ACCESS_SIGNATURE : REFRESH_SIGNATURE,
  });

  if (decoded.expired) {
    return next(new Error("Token expired", { cause: 401 }));
  }

  const user = await dbService.findOne({
    model: UserModel,
    filter: { _id: decoded.id },
  });

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  if (user.changeCredentialTime?.getTime >= decoded.iat * 1000) {
    return next(new Error("Token expired", { cause: 401 }));
  }

  return user;
};

export const authentication = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    req.user = await decodedToken({ authorization, next });
    return next();
  });
};

export const allowTo = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("Unauthorized", { cause: 403 }));
    }
    return next();
  });
};
