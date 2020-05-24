const {GraphQLObjectType, GraphQLInt} = require('graphql');

module.exports = new GraphQLObjectType({
    name: 'CountsType',
    description: 'Counts of Movies/Shows ingested by CP',
    fields: {
        show: {
            type: GraphQLInt,
            resolve: async (obj, args, {loaders}, {fieldName}) => {
                let result = await loaders.mdb.getCountsByCpIds.load(obj.cp_id);
                let r = result[0];
                return r ? r[fieldName + "Count"] : 0;
                //return mdUserCountDao(mClient).getCountByField(obj, fieldName + "Count");
            }
        },
        movie: {
            type: GraphQLInt,
            resolve: async (obj, args, {loaders}, {fieldName}) => {
                let result = await loaders.mdb.getCountsByCpIds.load(obj.cp_id);
                let r = result[0];
                return r ? r[fieldName + "Count"] : 0;
            }
        }
    }
});