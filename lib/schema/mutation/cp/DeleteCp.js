const {GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLID} = require('graphql');

const cpDao = require("../../../dao/mysql/cp");
const movieDao = require("../../../dao/mysql/movie");

module.exports = {
    type: GraphQLString,
    args: {
        email: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve: async (obj, {email}, {mysqlPool, loaders, mongoClient}) => {
        await movieDao(mysqlPool).deleteMovieByCpEmail(email);
        let cp = await loaders.cpByEmail.load(email);
        const mdCpCountDao = require('./../../../dao/mongo/cp')(mongoClient);
        await mdCpCountDao.deleteCpCount(cp.cp_id);
        await cpDao(mysqlPool).deleteCp(email);
        return "Deleted CP - " + email;
    }
}