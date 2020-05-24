const {winstonLogger} = require('../../../config/winstonLogger');
const humps = require('humps');
const util = require('util');
const orderCollectionByKey = require('../../utils/orderCollectionByKey');

module.exports = (mysqlPool) => {
    return {
        async getCpByEmail(emailId) {
            try {
                winstonLogger.info("Fetching cp by email :" + emailId);
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const result = await query(`select *
                                                      from content_partner.content_partner
                                                      where email IN(?)`, [emailId]);
                return orderCollectionByKey(result[0], emailId, 'email', false);
            } catch (e) {
                winstonLogger.error("Error in getting cp by email %s - %s", emailId, e);
            }
        },
        async getCpById(cpId) {
            try {
                winstonLogger.info("Fetching cp details by id :" + cpId);
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const result = await query(`select *
                                                      from content_partner.content_partner
                                                      where cp_id IN(?)`, [cpId]);
                return orderCollectionByKey(result[0], cpId, 'cp_id', false);
            } catch (e) {
                winstonLogger.error("Error in getting cp by ids %s - %s", cpId, e);
            }
        },
        async getCpIngestedTitles(cpIds) {
            try {
                winstonLogger.info("Getting CP Ingestion acitvities corresponding to id %s", cpIds);
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const res = await query(`
                select ingested_by, ingested_on, name, '' as title, 'movie' as type from content_partner.movie where ingested_by IN(?)
                 UNION  
                 select ingested_by, ingested_on, '' as name, title, 'show' as type from content_partner.show where ingested_by IN(?)`
                    ,[cpIds, cpIds]);
                let result = orderCollectionByKey(humps.camelizeKeys(res), cpIds, humps.camelize('ingested_by'), true);
                return result;
            } catch(e) {
                winstonLogger.error("Error in getting ingested title for cpdIds %s - %s: ", cpIds, e);
                throw e;
            };
        },
        async addNewCp(cp){
            try {
                winstonLogger.info("Add cp %s :" + cp);
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const result = await query(`insert into content_partner.content_partner(first_name, last_name, email) values(?,?,?)`, [cp.firstName, cp.lastName, cp.email]);
                winstonLogger.info("Result of cp addition is  :" + result);
                return result.insertId;
            } catch (e) {
                winstonLogger.info("Error in adding cp %s :" + cp);
            }
        },
        async updateCp(cp){
            try {
                winstonLogger.info("Updating cp %s :" + cp);
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const result = await query(`update content_partner.content_partner set first_name = ?, last_name = ? where email=?`, [cp.firstName, cp.lastName, cp.email]);
                winstonLogger.info("Result of cp addition is  :" + result);
            } catch (e) {
                winstonLogger.info("Error in adding cp %s :" + cp);
            }
        },
        async deleteCp(cpEmail){
            try {
                winstonLogger.info("Deleting cp %s :" + cpEmail);
                const query = util.promisify(mysqlPool.query).bind(mysqlPool);
                const result = await query(`delete from content_partner.content_partner where email=?`, [cpEmail]);
                winstonLogger.info("Result of cp addition is  :" + result);
            } catch (e) {
                winstonLogger.info("Error in adding cp %s :" + cpEmail);
            }
        }
    }
}