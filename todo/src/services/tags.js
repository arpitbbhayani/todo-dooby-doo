const mongo = require('../db/mongo');
const Promise = require('bluebird');

function tagConverter(x) {
    return {
        id: x._id,
        name: x.n,
        color: x.c,
    };
}

function toHuman(obj, fn) {
    if (Array.isArray(obj)) {
        return obj.map(fn);
    }
    return fn(obj);
}

function _create(tagDoc, callback) {
    const insertDoc = {
        n: tagDoc.n,
        c: tagDoc.c || '#000',
    };
    mongo.getConnection((db) => {
        const tags = db.collection('tags');
        tags.insertOne(insertDoc, (aerr, result) => {
            if (aerr) {
                return callback(aerr, null);
            }
            const tagInfo = {
                _id: result.insertedId,
                ...insertDoc,
            };
            return callback(null, toHuman(tagInfo, tagConverter));
        });
    });
}

function _getById(tagId, callback) {
    const searchDoc = {
        _id: mongo.toObjectId(tagId),
    };
    const projectionDoc = {};
    mongo.getConnection((db) => {
        const tags = db.collection('tags');
        tags.findOne(searchDoc, projectionDoc, (aerr, tag) => {
            if (aerr) {
                return callback(aerr, null);
            }
            if (!tag) {
                return callback(new Error(`Tag with id ${tagId} does not exist`), null);
            }
            return callback(null, toHuman(tag, tagConverter));
        });
    });
}

function _getByIdDetailed(tagId, callback) {
    const searchDoc = {
        _id: mongo.toObjectId(tagId),
    };
    const projectionDoc = {};
    mongo.getConnection((db) => {
        const tags = db.collection('tags');
        tags.findOne(searchDoc, projectionDoc, (aerr, tag) => {
            if (aerr) {
                return callback(aerr, null);
            }
            if (!tag) {
                return callback(new Error(`Tag with id ${tagId} does not exist`), null);
            }

            return callback(null, toHuman(tag, tagConverter));
        });
    });
}

function _getByName(name, callback) {
    const searchDoc = {
        n: mongo.toObjectId(name),
    };
    const projectionDoc = {};
    mongo.getConnection((db) => {
        const tags = db.collection('tags');
        tags.findOne(searchDoc, projectionDoc, (aerr, tag) => {
            if (aerr) {
                return callback(aerr, null);
            }
            if (!tag) {
                return callback(new Error(`Tag with name ${name} does not exist`), null);
            }
            return callback(null, toHuman(tag, tagConverter));
        });
    });
}

function _getAll(callback) {
    const searchDoc = {};
    const projectionDoc = {};
    mongo.getConnection((db) => {
        const tags = db.collection('tags');
        tags.find(searchDoc, projectionDoc).toArray((aerr, tag) => {
            if (aerr) {
                return callback(aerr, null);
            }
            return callback(null, toHuman(tag, tagConverter));
        });
    });
}

module.exports = {
    create(tagDoc, callback) {
        if (typeof callback === 'function') {
            return _create(tagDoc, callback);
        }
        return new Promise((resolve, reject) => {
            _create(tagDoc, (aerr, tag) => {
                if (aerr) return reject(aerr);
                return resolve(tag);
            });
        });
    },

    getById(tagId, callback) {
        if (typeof callback === 'function') {
            return _getById(tagId, callback);
        }
        return new Promise((resolve, reject) => {
            _getById(tagId, (aerr, tag) => {
                if (aerr) return reject(aerr);
                return resolve(tag);
            });
        });
    },

    getByIdDetailed(tagId, callback) {
        if (typeof callback === 'function') {
            return _getByIdDetailed(tagId, callback);
        }
        return new Promise((resolve, reject) => {
            _getByIdDetailed(tagId, (aerr, tag) => {
                if (aerr) return reject(aerr);
                return resolve(tag);
            });
        });
    },

    getByName(name, callback) {
        if (typeof callback === 'function') {
            return _getByName(name, callback);
        }
        return new Promise((resolve, reject) => {
            _getByName(name, (aerr, tag) => {
                if (aerr) return reject(aerr);
                return resolve(tag);
            });
        });
    },

    getAll(isComplete, callback) {
        if (typeof callback === 'function') {
            return _getAll(callback);
        }
        return new Promise((resolve, reject) => {
            _getAll((aerr, tags) => {
                if (aerr) return reject(aerr);
                return resolve(tags);
            });
        });
    },

};
