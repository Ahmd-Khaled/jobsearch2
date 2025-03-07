import { verifyToken } from "../../utils/token/token.js";
import * as dbService from "../../DB/dbService.js";
import { UserModel } from "../../DB/Models/user.model.js";
import { tokenTypes } from "../auth.middleware.js";

export const authenticationGraph = async ({
  Authorization,
  tokenType = tokenTypes.access,
  accessRoles = [],
}) => {
  // console.log("======= Authorization:", Authorization);
  // let Authorization = context.token;
  const [bearer, token] = Authorization.split(" ") || [];
  if (!bearer || !token) {
    throw new Error("Invalid token", { cause: 401 });
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

  const user = await dbService.findOne({
    model: UserModel,
    filter: { _id: decoded.id },
  });

  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }

  if (user.changeCredentialTime?.getTime >= decoded.iat * 1000) {
    throw new Error("Token expired", { cause: 401 });
  }

  if (accessRoles.length > 0 && !accessRoles.includes(user.role)) {
    throw new Error("Unauthorized access", { cause: 403 });
  }

  return user;
};
