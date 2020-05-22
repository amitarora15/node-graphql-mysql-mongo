const app = require('express')();
const graphqlHTTP = require('express-graphql');
const mysql = require('mysql');
const {MongoClient, Logger} = require('mongodb');
const DataLoader = require('dataloader');
const assert = require('assert');

const {winstonLogger} = require('../config/winstonLogger');

const config = require('../config/app');
const port = config.port;
const nodeEnv = config.nodeEnv;

const mysqlConfig = require('../config/mysql')[nodeEnv];
const mysqlPool = new mysql.createPool(mysqlConfig);

const mongoConfig = require('../config/mongo')[nodeEnv];

const ContentPartnerSchema = require('./schema');

const cpDao = require('./dao/mysql/cp')(mysqlPool);
/*const pgNamesDao = require('../database/dao/pgNamesDao')(mysqlPool);
const pgUserDao = require('../database/dao/pgUserDao')(mysqlPool);
const pgContestDao = require('../database/dao/pgContestDao')(mysqlPool);
const pgTotalVotesDao = require('../database/dao/pgTotalVotesDao')(mysqlPool);*/

winstonLogger.debug(`Running in ${nodeEnv} mode...`);

MongoClient.connect(mongoConfig.url, (error, mongoClient) => {

    Logger.setLevel('debug');
    Logger.filter('class', ['Server']);
   // const mdUserCountDao = require('../database/dao/mdUserCountDao')(mClient);

    const loaders = {
        cpsByEmail : new DataLoader(cpDao.getCpsByEmail),
        /*usersByApiKeys : new DataLoader(pgUserDao.getUsersByApiKeys),
        contestsByUserIds : new DataLoader(pgContestDao.getContests),
        namesByContestIds : new DataLoader(pgNamesDao.getNamesByContests),
        totalVotes : new DataLoader(pgTotalVotesDao.getTotalVotesForNames),
        activityByUser : new DataLoader(pgUserDao.getUserActivties),
        mdb : {
            getUsersByIds : new DataLoader(mdUserCountDao.getUsersByIds)
        }*/
    }
    app.use('/graphql', (req, res) => {
        graphqlHTTP({
            graphiql: true,
            pretty: true,
            schema: ContentPartnerSchema,
            context: {mysqlPool, mongoClient, loaders}
        })(req, res);
    });

    app.listen(port, () => {
        winstonLogger.info("GraphQL Server listening on port %d", port);
    });
});

