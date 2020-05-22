const {GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLSchema} = require('graphql');

const CpType = require("./types/CpType");

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: '*Entry point* for all queries for Content Partner and associated Entity',
    fields: {
        greet: {
            type: GraphQLString,
            args: {
                "name": {
                    type: new GraphQLNonNull(GraphQLString),
                    description: "Name of person our GraphQL server greets"
                }
            },
            description: 'The *greeting* should be with Hello',
            resolve: (obj, args) => {
                return 'Hello ' + args.name;
            }

        },
        cp: {
            type: CpType,
            description: 'Content Partner Information',
            args: {
                "email": {
                    type: new GraphQLNonNull(GraphQLString),
                    description: "Email id of content partner is required"
                }
            },
            resolve: (object, args, {loaders}) => {
                return loaders.cpsByEmail.load(args.email);
                //return cpDao(mysqlPool).getCpsByEmail(args.email);
            }
        }
    }
});

//const AddContestMutation = require('./mutation/AddContest');

const RootMutation = new GraphQLObjectType({
    name: 'RootMutationType',
    description: '*Entry point* for all mutation for Content Partner and associated Entity'/*,
    fields: () =>  ({
        AddContest : AddContestMutation
    })*/
});

const ContentPartner = new GraphQLSchema({
    query: RootQuery,
    //mutation : RootMutation,
    description: '*Entry point* for all operations'
});

module.exports = ContentPartner;


//Graphql query
/* http://localhost:3000/graphql
query nameQuery {
  greet
  user(key: "0000") {
    email
    id
    firstName
    lastName
    fullName
    activities {
    	... on ContestType {
        header  : title
      }
      ... on NamesType {
        header : label
      }
    }
    contests {
      id
      title
      code
      status
      createdAt
      names {
        label
        createdAt
        description
        id
        createdBy {
          id
          fullName
        }
        totalVotes {
          up
          down
        }
      }
    }
    counts {
      contests
      names
      votes
    }
  }

}

mutation addContest($input : ContestInputType!) {
  AddContest(input : $input) {
    id
    title
    status
    code
    createdAt
  }

}


{
  "input": {
    "apiKey": "0000",
    "title": "Medhu Course New",
    "description": "Description"
  }
}
 */