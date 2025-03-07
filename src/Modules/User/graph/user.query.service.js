import * as dbService from "../../../DB/dbService.js";
import { UserModel } from "../../../DB/Models/user.model.js";

export const getAllUsers = async (parent, args) => {
  const users = await dbService.findWithoutPaginate({
    model: UserModel,
  });

  return {
    message: "Users fetched successfully",
    statusCode: 200,
    data: users,
  };
};
