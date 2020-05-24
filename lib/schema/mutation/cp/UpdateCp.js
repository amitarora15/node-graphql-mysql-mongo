const {GraphQLInputObjectType, GraphQLNonNull, GraphQLString} = require('graphql');

const CpType = require('../../query/CpType');
const CpInputType = require('./type/CpInputType');
const cpDao = require("../../../dao/mysql/cp");

module.exports = {
    type: CpType,
    args: {
        cp: {
            type: new GraphQLNonNull(CpInputType)
        }
    },
    resolve: async (obj, {cp}, {mysqlPool, loaders}) => {
        await cpDao(mysqlPool).updateCp(cp);
        return loaders.cpByEmail.load(cp.email);
    }
}