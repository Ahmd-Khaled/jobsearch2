import * as dbService from "../../../DB/dbService.js";
import { UserModel } from "../../../DB/Models/user.model.js";
import { authenticationGraph } from "../../../middlewares/graph/graph.auth.middleware.js";
import { validationGraph } from "../../../middlewares/graph/graph.validation.middleware.js";
import { roleTypes } from "../../../utils/variables.js";

export const getAllUsers = async (parent, args, context) => {
  // console.log("............................ context:", context);

  // Apply GraphQl Validation
  // await validationGraph(adminGraphSchmea, args);

  //   Apply GraphQl Authontication & Authorization
  const user = await authenticationGraph({
    Authorization: context.token,
    accessRoles: roleTypes.Admin,
  });

  const users = await dbService.findWithoutPaginate({
    model: UserModel,
  });

  return {
    message: "Users fetched successfully",
    statusCode: 200,
    data: users,
  };
};
