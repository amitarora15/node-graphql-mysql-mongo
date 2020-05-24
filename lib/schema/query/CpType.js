const {GraphQLString, GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLList} = require('graphql');

const caseConvertor = require('../../utils/caseConvertor');

module.exports = new GraphQLObjectType({
    name: 'CpType',
    description: 'Content Partner Information details',
    fields: () => {
        const MovieType = require('./MovieType');
        const ShowType = require('./ShowType');
        const CountsType = require('./CountsType');
        const IngestedTitleType = require('./IngestedTitleType');
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
                type: new GraphQLList(MovieType),
                resolve: (obj, args, {loaders}) => {
                    return loaders.moviesByCpIds.load(obj.cp_id);
                }

            },
            shows: {
                type: new GraphQLList(ShowType),
                resolve: (obj, args, {loaders}) => {
                    return loaders.showsByCpIds.load(obj.cp_id);
                }
            },
            counts : {
                type: CountsType,
                resolve: obj => {
                    return obj;
                }
            },
            ingested_titles: {
                type: new GraphQLList(IngestedTitleType),
                resolve: (obj, args, {loaders}) => {
                    return loaders.activityByCpIds.load(obj.cp_id);
                }
            }
        }
    }
});