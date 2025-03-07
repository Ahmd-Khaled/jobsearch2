import * as dbService from "../../../DB/dbService.js";
import { CompanyModel } from "../../../DB/Models/company.model.js";

export const getAllCompanies = async (parent, args) => {
  const companies = await dbService.findWithoutPaginate({
    model: CompanyModel,
  });

  return {
    message: "Companies fetched successfully",
    statusCode: 200,
    data: companies,
  };
};
