const {GraphQLString, GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLList} = require('graphql');


module.exports = new GraphQLObjectType({
    name: 'MovieType',
    description: 'Movie details ingested by Content Partner',
    fields: () => {
        const CpType = require('./CpType');
        const GenreType = require('./GenreType');
        return {
            id: {
                type: GraphQLID,
                resolve: obj => {
                    return obj.movieId;
                }
            },
            name: {
                type: new GraphQLNonNull(GraphQLString)
             },
            genre: {
                type: new GraphQLNonNull(GenreType)
            },
            ingestedOn: {
                type: GraphQLString
            },
            ingestedBy: {
                type: CpType,
                resolve : (obj, args, {loaders}) => {
                    return loaders.cpById.load(obj.ingestedBy);
                }

            }
        }
    }
});