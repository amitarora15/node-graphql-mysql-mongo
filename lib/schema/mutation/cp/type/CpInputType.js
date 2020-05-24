const {GraphQLInputObjectType, GraphQLNonNull, GraphQLString} = require('graphql');

module.exports = new GraphQLInputObjectType({
    name: 'CpInputType',
    fields: {
        email: {
            type: new GraphQLNonNull(GraphQLString)
        },
        firstName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        lastName: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});