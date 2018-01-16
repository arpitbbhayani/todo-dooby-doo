const router = require('express').Router();

module.exports = router;

router.get('/', (req, res, next) => res.render('ex-with-graphql/index', {
    incomplete: true,
}));

router.get('/completed', (req, res, next) => res.render('ex-with-graphql/index', {
    complete: true,
}));
