import { GraphQLObjectType, GraphQLSchema } from "graphql";
import * as userGraphController from "./User/graph/user.graph.controller.js";
import * as companyGraphController from "./Company/graph/company.graph.controller.js";
// ----------------------------GraphQl-------------------------------
export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "adminDashboard",
    description: "Admin all data query",
    fields: {
      ...userGraphController.query,
      ...companyGraphController.query,
    },
  }),
});
// ----------------------------GraphQl-------------------------------
