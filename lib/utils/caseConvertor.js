const {GraphQLType} = require('graphql');
const humps = require('humps');

module.exports = {
    fromSnakeCase(GraphQLType) {
        return {
            type: GraphQLType,
            resolve(obj, args, ctx, {fieldName}){
                return obj[humps.decamelize(fieldName)];
            }
        }
    }
}

