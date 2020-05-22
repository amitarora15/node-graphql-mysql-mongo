const {GraphQLString, GraphQLObjectType, GraphQLID, GraphQLNonNull} = require('graphql');

const caseConvertor = require('../../utils/caseConvertor');

module.exports = new GraphQLObjectType({
    name: 'CpType',
    description: 'Content Partner Information details',
    fields: () => {
        return {
            id: {
                type: GraphQLID,
                resolve: obj => {
                    return obj.cp_id;
                }
            },
            email: {
                type: new GraphQLNonNull(GraphQLString)
            },
            firstName: {
                type: new GraphQLNonNull(GraphQLString),
                resolve: obj => {
                    return obj.first_name;
                }
            },
            lastName: caseConvertor.fromSnakeCase(GraphQLString),
            fullName: {
                type: GraphQLString,
                resolve: obj => {
                    return obj.first_name + ' ' + obj.last_name;
                }
            },
            movies: {
                type: MovieType

            }
        }
    }
});