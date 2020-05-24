const {GraphQLInputObjectType, GraphQLNonNull, GraphQLString} = require('graphql');

module.exports = new GraphQLInputObjectType({
    name: 'MovieInputType',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        genre: {
            type: new GraphQLNonNull(GraphQLString)
        },
        cpEmail: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});