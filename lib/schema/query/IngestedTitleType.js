const {GraphQLUnionType} = require('graphql');

const MovieType = require("./MovieType");
const ShowType = require("./ShowType");

module.exports = new GraphQLUnionType({
    name :'IngestedTitleType',
    types : [ShowType, MovieType],
    resolveType : value =>{
        let res = value.type == 'show' ? ShowType : MovieType;
        return res;
    }
});