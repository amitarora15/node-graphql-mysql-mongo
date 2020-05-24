const {GraphQLInputObjectType, GraphQLNonNull, GraphQLString} = require('graphql');

const MovieType = require('../../query/MovieType');
const MovieInputType = require('./type/MovieInputType');
const movieDao = require("../../../dao/mysql/movie");

module.exports = {
    type: MovieType,
    args: {
        movie: {
            type: new GraphQLNonNull(MovieInputType)
        }
    },
    resolve: async (obj, {movie}, {mysqlPool, loaders, mongoClient}) => {
        const movieId = await movieDao(mysqlPool).addNewMovie(movie);
        const result = await loaders.moviesByIds.load(movieId);
        const mdCpCountDao = require('./../../../dao/mongo/cp')(mongoClient);
        const count = await loaders.mdb.getCountsByCpIds.load(result.ingestedBy);
        let movieCount = 0;
        let showCount = 0;
        if(count && count.length > 0){
            movieCount = count[0].movieCount ? count[0].movieCount + 1 : 0;
            await mdCpCountDao.updateCpCount(result.ingestedBy, movieCount, showCount);
        } else {
            movieCount = 1;
            await mdCpCountDao.insertCpCount(result.ingestedBy, movieCount, showCount);
        }
        return result;
    }
}