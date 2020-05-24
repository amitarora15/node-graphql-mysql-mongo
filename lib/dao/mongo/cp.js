const {winstonLogger} = require('../../../config/winstonLogger');
const orderCollectionByKey = require('../../utils/orderCollectionByKey');

module.exports = (mClient) => {
    return {
        async getCountByField(cp, countField) {
            try{
                let db = mClient.db();
                winstonLogger.info("Get %s count for a cp %s ", countField, cp.id);
                let userCounts = await db.collection('content-partner').findOne({cpId : cp.id });
                return userCounts[countField];
            } catch (e) {
                winstonLogger.error("Error in getting count for field %s for cp %s - %s", countField, cp.id, e);
            }
        },
        async getCountsByCpIds(cpIds) {
            try {
                let db = mClient.db();
                winstonLogger.info("Get all counts for cp %s ", cpIds);
                let cps = await db.collection('content-partner').find({cpId: {$in: cpIds}}).toArray();
                return orderCollectionByKey(cps, cpIds, 'cpId', true);
            } catch (e) {
                winstonLogger.error("Error in getting count for cpIds %s - %s", cpIds, e);
            }
        },
        async updateCpCount(cpId, mCount, sCount) {
            try {
                let db = mClient.db();
                winstonLogger.info("Updating counts for cp %s with count values Movie - %d, Show - %d ", cpId, mCount, sCount);
                let query = { cpId: cpId };
                let newValues = { $set: {movieCount: mCount, showCount: sCount } };
                let result = await db.collection("content-partner").updateOne(query, newValues);
                winstonLogger.info("Result : " + result);
            } catch (e) {
                winstonLogger.error("Error in updating count for cpIds %s - %s", cpId, e);
            }
        },
        async insertCpCount(cpId, mCount, sCount) {
            try {
                let db = mClient.db();
                winstonLogger.info("Inserting counts for cp %s with count values Movie - %d, Show - %d ", cpId, mCount, sCount);
                let count = { cpId: cpId, movieCount: mCount, showCount: sCount  };
                let result = await db.collection("content-partner").insertOne(count);
                winstonLogger.info("Result : " + result);
            } catch (e) {
                winstonLogger.error("Error in updating count for cpIds %s - %s", cpId, e);
            }
        },
        async deleteCpCount(cpId) {
            try {
                let db = mClient.db();
                winstonLogger.info("Deleting counts for cp %s  ", cpId);
                let query = { cpId: cpId };
                let result = await db.collection("content-partner").deleteOne(query);
                winstonLogger.info("Result : " + result);
            } catch (e) {
                winstonLogger.error("Error in deleting count for cpIds %s - %s", cpId, e);
            }
        }
    }
}