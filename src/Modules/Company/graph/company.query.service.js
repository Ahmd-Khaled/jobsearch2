import * as dbService from "../../../DB/dbService.js";
import { CompanyModel } from "../../../DB/Models/company.model.js";
import { authenticationGraph } from "../../../middlewares/graph/graph.auth.middleware.js";
import { roleTypes } from "../../../utils/variables.js";

export const getAllCompanies = async (parent, args, context) => {
  // Apply GraphQl Validation
  // await validationGraph(adminGraphSchmea, args);

  //   Apply GraphQl Authontication & Authorization
  const user = await authenticationGraph({
    Authorization: context.token,
    accessRoles: roleTypes.Admin,
  });

  const companies = await dbService.findWithoutPaginate({
    model: CompanyModel,
  });

  return {
    message: "Companies fetched successfully",
    statusCode: 200,
    data: companies,
  };
};
