const {GraphQLString, GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLList, GraphQLInt} = require('graphql');


module.exports = new GraphQLObjectType({
    name: 'ShowType',
    description: 'Show details ingested by Content Partner',
    fields: () => {
        const CpType = require('./CpType');
        const GenreType = require('./GenreType');
        return {
            id: {
                type: GraphQLID,
                resolve: obj => {
                    return obj.showId;
                }
            },
            title: {
                type: new GraphQLNonNull(GraphQLString)
            },
            genre: {
                type: new GraphQLNonNull(GenreType)
            },
            seasonCount: {
                type : GraphQLInt,
                resolve: obj => {
                    return obj.noOfSeasons;
                }
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