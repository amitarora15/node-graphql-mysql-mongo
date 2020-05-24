const {winstonLogger} = require('../../../config/winstonLogger');
const humps = require('humps');
const util = require('util');
const orderCollectionByKey = require('../../utils/orderCollectionByKey');

module.exports = (mysqlPool) => {
    return {
        async getShowsByCpIds(cpids) {
            try {
                winstonLogger.info("Fetching shows by cp ids :" + cpids);
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const result = await query(`select *
                                                      from content_partner.show
                                                      where ingested_by IN(?)`, [cpids]);
                return orderCollectionByKey(humps.camelizeKeys(result), cpids, humps.camelize('ingested_by'), true);
            } catch (e) {
                winstonLogger.error("Error in getting shows by cpids %s - %s", cpids, e);
            }
        },
        async getShowsByTitle (title) {
            try {
                winstonLogger.info("Fetching shows by title :" + title);
                title = '%' + title + '%';
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const result = await query(`select *
                                                      from content_partner.show
                                                      where title  like ?`, [title]);
                return humps.camelizeKeys(result);
            } catch (e) {
                winstonLogger.error("Error in getting shows by title %s - %s", title, e);
            }
        }
    }
}