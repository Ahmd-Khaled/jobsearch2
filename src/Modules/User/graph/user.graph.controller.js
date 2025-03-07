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
import * as userGraphService from "./user.query.service.js";

export const query = {
  getAllUsers: {
    type: new GraphQLObjectType({
      name: "getAllUsers",
      fields: {
        message: { type: GraphQLString },
        statusCode: { type: GraphQLInt },
        data: {
          type: new GraphQLList(
            new GraphQLObjectType({
              name: "oneUserResponse",
              fields: {
                _id: { type: GraphQLID },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
                mobileNumber: { type: GraphQLString },
                DOB: { type: GraphQLString },
                isConfirmed: { type: GraphQLBoolean },
                profilePic: {
                  type: new GraphQLObjectType({
                    name: "profilePic",
                    fields: {
                      secure_url: { type: GraphQLString },
                      public_id: { type: GraphQLString },
                    },
                  }),
                },
                coverPic: {
                  type: new GraphQLObjectType({
                    name: "coverPic",
                    fields: {
                      secure_url: { type: GraphQLString },
                      public_id: { type: GraphQLString },
                    },
                  }),
                },
                gender: {
                  type: new GraphQLEnumType({
                    name: "Gender",
                    values: {
                      Male: { type: GraphQLString },
                      Female: { type: GraphQLString },
                    },
                  }),
                },
                provider: {
                  type: new GraphQLEnumType({
                    name: "Provider",
                    values: {
                      System: { type: GraphQLString },
                      Google: { type: GraphQLString },
                    },
                  }),
                },
                role: {
                  type: new GraphQLEnumType({
                    name: "Role",
                    values: {
                      Admin: { type: GraphQLString },
                      User: { type: GraphQLString },
                    },
                  }),
                },
              },
            })
          ),
        },
      },
    }),
    resolve: userGraphService.getAllUsers,
  },
};
