const {GraphQLEnumType} = require('graphql');

module.exports = new GraphQLEnumType({
    name: 'GenreType',
    description: 'Genre details',
    values : {
        THRILLER : { value : 'thriller'},
        ROMANCE : { value : 'romance'},
        ACTION : { value : 'action'},
        COMEDY : { value : 'comedy'}
    }
});