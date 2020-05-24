const {winstonLogger} = require('../../../config/winstonLogger');
const humps = require('humps');
const util = require('util');
const orderCollectionByKey = require('../../utils/orderCollectionByKey');

module.exports = (mysqlPool) => {
    return {
        async getMoviesByCpIds(cpids) {
            try {
                winstonLogger.info("Fetching movies by cp ids :" + cpids);
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const result = await query(`select *
                                                      from content_partner.movie
                                                      where ingested_by IN(?)`, [cpids]);
                return orderCollectionByKey(humps.camelizeKeys(result), cpids, humps.camelize('ingested_by'), true);
            } catch (e) {
                winstonLogger.error("Error in getting movies by cpids %s - %s", cpids, e);
            }
        },
        async getMoviesByTitle(title) {
            try {
                winstonLogger.info("Fetching movies by title :" + title);
                title = '%' + title + '%';
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const result = await query(`select *
                                                      from content_partner.movie
                                                      where name like ?`, [title]);
                return humps.camelizeKeys(result);
            } catch (e) {
                winstonLogger.error("Error in getting movies by title %s - %s", title, e);
            }
        },
        async getMoviesByIds(movieIds) {
            try {
                winstonLogger.info("Fetching movies by id :" + movieIds);
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const result = await query(`select *
                                                      from content_partner.movie
                                                      where movie_id IN(?)`, [movieIds]);
                return orderCollectionByKey(humps.camelizeKeys(result[0]), movieIds, humps.camelize('movie_id'), false);
            } catch (e) {
                winstonLogger.error("Error in getting movies by ids %s - %s", movieIds, e);
            }
        },
        async addNewMovie(movie) {
            try {
                winstonLogger.info("Add movie %s :" + movie);
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const result = await query(`insert into content_partner.movie(name, genre, ingested_by) values(?,?,(select cp_id from content_partner.content_partner where email=? ))`, [movie.name, movie.genre, movie.cpEmail]);
                winstonLogger.info("Result of movie addition is  :" + result);
                return result.insertId;
            } catch (e) {
                winstonLogger.info("Error in adding movie %s - %s " + movie, e);
            }
        },
        async deleteMovieByCpEmail(cpEmail) {
            try {
                winstonLogger.info("Delete movie for cp email %s :" + cpEmail);
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const result = await query(`delete from content_partner.movie where ingested_by=(select cp_id from content_partner.content_partner where email=? )`, [cpEmail]);
                winstonLogger.info("Result of movie deletion is  :" + result);
            } catch (e) {
                winstonLogger.info("Error in deleting movie for cp email %s - %s " + cpEmail, e);
            }
        }
    }
}