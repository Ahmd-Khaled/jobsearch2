import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import * as companyGraphService from "./company.query.service.js";

export const query = {
  getAllCompanies: {
    type: new GraphQLObjectType({
      name: "getAllCompanies",
      fields: {
        message: { type: GraphQLString },
        statusCode: { type: GraphQLInt },
        data: {
          type: new GraphQLList(
            new GraphQLObjectType({
              name: "oneCompanyResponse",
              fields: {
                _id: { type: GraphQLID },
                companyName: { type: GraphQLString },
                description: { type: GraphQLString },
                industry: { type: GraphQLString },
                address: { type: GraphQLString },
                companyEmail: { type: GraphQLString },
                bannedAt: { type: GraphQLString },
                approvedByAdmin: { type: GraphQLBoolean },
                legalAttachment: {
                  type: new GraphQLObjectType({
                    name: "legalAttachment",
                    fields: {
                      secure_url: { type: GraphQLString },
                      public_id: { type: GraphQLString },
                    },
                  }),
                },
                coverPic: {
                  type: new GraphQLObjectType({
                    name: "companyCoverPic",
                    fields: {
                      secure_url: { type: GraphQLString },
                      public_id: { type: GraphQLString },
                    },
                  }),
                },
                logo: {
                  type: new GraphQLObjectType({
                    name: "logo",
                    fields: {
                      secure_url: { type: GraphQLString },
                      public_id: { type: GraphQLString },
                    },
                  }),
                },
              },
            })
          ),
        },
      },
    }),
    resolve: companyGraphService.getAllCompanies,
  },
};
