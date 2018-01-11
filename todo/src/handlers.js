const { MongoError } = require('./db/mongo');

module.exports = {
    todoErrorHandler(err, req, res, next) {
        const { out } = req.query;
        const index = err.message.indexOf('::');
        if (index !== -1) {
            const type = err.message.substring(0, index);
            const error = err.message.substring(index + 2);

            if (out === 'json') {
                return res.status(400).send({
                    error,
                    type,
                });
            }
            return res.status(400).render('errors/todo', {
                type,
                error,
            });
        }
        return next(err);
    },

    logError(err, req, res, next) {
        console.error(err.message, err.stack);
        return next(err);
    },

    mongoErrorHandler(err, req, res, next) {
        if (err instanceof MongoError) {
            console.error(err.message, err.stack);
            return res.status(500).render('errors/500');
        }
        return next(err);
    },

    notFoundHandler(req, res) {
        return res.status(404).render('errors/404');
    },

    errorHandler(err, req, res, next) {
        return res.status(500).render('errors/500');
    },
};

