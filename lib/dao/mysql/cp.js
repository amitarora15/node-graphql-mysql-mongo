const {winstonLogger} = require('../../../config/winstonLogger');
const humps = require('humps');
const util = require('util');
const orderCollectionByKey = require('../../utils/orderCollectionByKey');

module.exports = (mysqlPool) => {
    return {
        async getCpsByEmail(emailIds) {
            try {
                winstonLogger.info("Fetching cp by email ids :" + emailIds);
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const result = await query(`select *
                                                      from content_partner.content_partner
                                                      where email = ANY_VALUE(?)`, [emailIds]);
                return orderCollectionByKey(result[0], emailIds, 'email', false);
            } catch (e) {
                winstonLogger.error("Error in getting cp by email %s %s", emailIds, e);
            }
        }
    }
}