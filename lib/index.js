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
const movieDao = require('./dao/mysql/movie')(mysqlPool);
const showDao = require('./dao/mysql/show')(mysqlPool);

winstonLogger.debug(`Running in ${nodeEnv} mode...`);

MongoClient.connect(mongoConfig.url, (error, mongoClient) => {

    Logger.setLevel('debug');
    Logger.filter('class', ['Server']);
    const mdCpCountDao = require('./dao/mongo/cp')(mongoClient);

    const loaders = {
        cpByEmail : new DataLoader(cpDao.getCpByEmail, { cache: false }),
        cpById : new DataLoader(cpDao.getCpById),
        moviesByCpIds : new DataLoader(movieDao.getMoviesByCpIds, { cache: false }),
        showsByCpIds : new DataLoader(showDao.getShowsByCpIds, { cache: false }),
        activityByCpIds : new DataLoader(cpDao.getCpIngestedTitles, { cache: false }),
        mdb : {
            getCountsByCpIds : new DataLoader(mdCpCountDao.getCountsByCpIds, { cache: false })
        },
        moviesByIds : new DataLoader(movieDao.getMoviesByIds, { cache: false })
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

