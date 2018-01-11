const mongo = require('../db/mongo');
const tagService = require('../services/tags');
const Promise = require('bluebird');

function todoConverter(x) {
    return {
        id: x._id,
        todo: x.t,
        created_at: x.cra,
        is_complete: x.ic,
        tags: x.tg,
    };
}

function toHuman(obj, fn) {
    if (Array.isArray(obj)) {
        return obj.map(fn);
    }
    return fn(obj);
}

function _create(todoDoc, callback) {
    const currentDate = new Date();
    Promise.all(todoDoc.tg.filter(x => x).map(x => tagService.getById(x)))
        .then((tags) => {
            const insertDoc = {
                t: todoDoc.t,
                cra: currentDate,
                ic: false,
                tg: tags.map(x => x.id),
            };
            mongo.getConnection((db) => {
                const todos = db.collection('todos');
                todos.insertOne(insertDoc, (aerr, result) => {
                    if (aerr) {
                        return callback(aerr, null);
                    }
                    const todoInfo = {
                        _id: result.insertedId,
                        ...insertDoc,
                        tg: tags,
                    };
                    return callback(null, toHuman(todoInfo, todoConverter));
                });
            });
        }).catch(aerr => callback(aerr, null));
}

function _getById(todoId, callback) {
    const searchDoc = {
        _id: mongo.toObjectId(todoId),
    };
    const projectionDoc = {
    };
    mongo.getConnection((db) => {
        const todos = db.collection('todos');
        todos.findOne(searchDoc, projectionDoc, (aerr, todo) => {
            if (aerr) {
                return callback(aerr, null);
            }
            return callback(null, toHuman(todo, todoConverter));
        });
    });
}

function _getAllByState(isComplete, callback) {
    const searchDoc = {
        ic: isComplete,
    };
    const projectionDoc = {
    };
    const orderDoc = {
        cra: -1,
    };
    mongo.getConnection((db) => {
        const todos = db.collection('todos');
        todos.find(searchDoc, projectionDoc).sort(orderDoc).toArray((aerr, allTodos) => {
            if (aerr) {
                return callback(aerr, null);
            }
            return callback(null, toHuman(allTodos, todoConverter));
        });
    });
}

function _changeState(todoId, isComplete, callback) {
    const searchDoc = {
        _id: mongo.toObjectId(todoId),
    };

    const updateDoc = {
        $set: {
            ic: isComplete,
        },
    };

    mongo.getConnection((db) => {
        const todos = db.collection('todos');
        todos.updateOne(searchDoc, updateDoc, (aerr) => {
            if (aerr) {
                return callback(aerr);
            }
            return callback(null);
        });
    });
}

module.exports = {
    create(todoDoc, callback) {
        if (typeof callback === 'function') {
            return _create(todoDoc, callback);
        }
        return new Promise((resolve, reject) => {
            _create(todoDoc, (aerr, todo) => {
                if (aerr) return reject(aerr);
                return resolve(todo);
            });
        });
    },

    getById(todoId, callback) {
        if (typeof callback === 'function') {
            return _getById(todoId, callback);
        }
        return new Promise((resolve, reject) => {
            _getById(todoId, (aerr, todo) => {
                if (aerr) return reject(aerr);
                return resolve(todo);
            });
        });
    },

    getAllByState(isComplete, callback) {
        if (typeof callback === 'function') {
            return _getAllByState(isComplete, callback);
        }
        return new Promise((resolve, reject) => {
            _getAllByState(isComplete, (aerr, todos) => {
                if (aerr) return reject(aerr);
                return resolve(todos);
            });
        });
    },

    changeState(todoId, isComplete, callback) {
        if (typeof callback === 'function') {
            return _changeState(todoId, isComplete, callback);
        }
        return new Promise((resolve, reject) => {
            _changeState(todoId, isComplete, (aerr, todo) => {
                if (aerr) return reject(aerr);
                return resolve(todo);
            });
        });
    },

};
