const Promise = require('bluebird');
const router = require('express').Router();
const todoService = require('../services/todos');
const tagService = require('../services/tags');

module.exports = router;

router.get('/', (req, res, next) => {
    Promise.all([
        todoService.getAllDetailedByState(false),
        tagService.getAll(),
    ]).then(([todos, tags]) => {
        res.render('ex-vanilla/index', {
            todos,
            tags,
            incomplete: true,
        });
    }).catch(aerr => next(aerr));
});

router.get('/completed', (req, res, next) => {
    Promise.all([
        todoService.getAllDetailedByState(true),
        tagService.getAll(),
    ]).then(([todos, tags]) => {
        res.render('ex-vanilla/index', {
            todos,
            tags,
            incomplete: true,
        });
    }).catch(aerr => next(aerr));
});

router.get('/tags', (req, res, next) => {
    tagService.getAll()
        .then(tags => res.render('ex-vanilla/tags', {
            tags,
        }))
        .catch(aerr => next(aerr));
});

router.get('/tags/:tagId', (req, res, next) => {
    const { tagId } = req.params;
    Promise.all([
        tagService.getByIdDetailed(tagId),
        todoService.getAllDetailedByTag(tagId),
    ]).then(([tag, todos]) => {
        const tagDetailed = {
            ...tag,
            todos,
        };
        res.render('ex-vanilla/tag-detail', {
            tag: tagDetailed,
        });
    }).catch(aerr => next(aerr));
});

router.post('/todos', (req, res, next) => {
    const { todo } = req.body;
    const { tag1, tag2, tag3 } = req.body;
    const todoDoc = {
        t: todo,
        tg: [tag1, tag2, tag3],
    };
    todoService.create(todoDoc)
        .then(() => res.redirect('/ex-vanilla'))
        .catch(aerr => next(aerr));
});

router.post('/tags', (req, res, next) => {
    const { name, color } = req.body;
    const tagDoc = {
        n: name,
        c: color,
    };
    tagService.create(tagDoc)
        .then(() => res.redirect('/ex-vanilla/tags'))
        .catch(aerr => next(aerr));
});

router.post('/todos/:id/complete', (req, res, next) => {
    const { id } = req.params;
    todoService.changeState(id, true)
        .then(() => res.redirect('/ex-vanilla'))
        .catch(aerr => next(aerr));
});

router.post('/todos/:id/incomplete', (req, res, next) => {
    const { id } = req.params;
    todoService.changeState(id, false)
        .then(() => res.redirect('/ex-vanilla'))
        .catch(aerr => next(aerr));
});
