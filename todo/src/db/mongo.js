const config = require('config');
const { MongoClient, ObjectID, MongoError } = require('mongodb');

let db;

function getConnection(callback) {
    if (db) { return callback(db); }
    MongoClient.connect(config.get('database.mongo.url'), (err, database) => {
        if (err) { throw err; }
        db = database;
        return callback(db);
    });
    return null;
}

function toObjectId(id) {
    if (ObjectID.isValid(id)) { return ObjectID(id); }
    return id;
}

function newObjectId() {
    return ObjectID();
}

module.exports = {
    getConnection,
    toObjectId,
    MongoError,
    newObjectId,
};
