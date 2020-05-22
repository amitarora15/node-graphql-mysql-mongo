const { MongoClient } = require('mongodb');
const assert = require('assert');

const { nodeEnv } = require('../config/app');
const mongoConfig = require('../config/mongo')[nodeEnv];

MongoClient.connect(mongoConfig.url, (err, mongoClient) => {
    assert.equal(null, err);
    const db = mongoClient.db();
    db.collection('content-partner').insertMany([
        {
            cpId: 1,
            moviesCount: 2,
            showCount: 0
        },
        {
            cpId: 1,
            moviesCount: 1,
            showCount: 2
        }
    ]).then(response => {
        console.log(response);
        mongoClient.close();
    });
});
