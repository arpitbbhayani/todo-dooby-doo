const router = require('express').Router();
const todoService = require('../services/todos');

module.exports = router;

router.get('/', (req, res, next) => {
    todoService.getAllByState(false)
        .then(todos => res.render('ex-vanilla/index', {
            todos,
            incomplete: true,
        }))
        .catch(aerr => next(aerr));
});

router.get('/completed', (req, res, next) => {
    todoService.getAllByState(true)
        .then(todos => res.render('ex-vanilla/index', {
            todos,
            complete: true,
        }))
        .catch(aerr => next(aerr));
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
