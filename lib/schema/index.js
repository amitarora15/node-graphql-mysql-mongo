const {GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList} = require('graphql');

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: '*Entry point* for all queries for Content Partner and associated Entity',
    fields: () => {
        const CpType = require("./query/CpType");
        const MovieType = require("./query/MovieType");
        const ShowType = require("./query/ShowType");
        const movieDao = require("../dao/mysql/movie");
        const showDao = require("../dao/mysql/show");
        return {
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
                    return loaders.cpByEmail.load(args.email);
                    //return cpDao(mysqlPool).getCpsByEmail(args.email);
                }
            },
            movie: {
                type: new GraphQLList(MovieType),
                description: 'Movie Information by Title',
                args: {
                    "title": {
                        type: new GraphQLNonNull(GraphQLString),
                        description: "Title of Movie"
                    }
                },
                resolve: (object, args, {loaders, mysqlPool}) => {
                    return movieDao(mysqlPool).getMoviesByTitle(args.title);
                }
            },
            show: {
                type: new GraphQLList(ShowType),
                description: 'ShowType Information by Title',
                args: {
                    "title": {
                        type: new GraphQLNonNull(GraphQLString),
                        description: "Title of Show"
                    }
                },
                resolve: (object, args, {loaders, mysqlPool}) => {
                    return showDao(mysqlPool).getShowsByTitle(args.title);
                }
            }
        }
    }
});

const RootMutation = new GraphQLObjectType({
    name: 'RootMutationType',
    description: '*Entry point* for all mutation for Content Partner and associated Entity',
    fields: () =>  {
        const AddCp = require('./mutation/cp/AddCp');
        const UpdateCp = require('./mutation/cp/UpdateCp');
        const DeleteCp = require('./mutation/cp/DeleteCp');
        const AddMovie = require('./mutation/movie/AddMovie');
        return {
            AddCp : AddCp,
            UpdateCp : UpdateCp,
            DeleteCp : DeleteCp,
            AddMovie : AddMovie
        }
    }
});

const ContentPartner = new GraphQLSchema({
    query: RootQuery,
    mutation : RootMutation,
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