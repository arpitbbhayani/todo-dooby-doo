const tagService = require('../services/tags');
const todoService = require('../services/todos');

const resolvers = {
    Query: {
        todos: (_, args) => todoService.getAllByState(args.is_complete),
        todo: (_, args) => todoService.getById(args.id),
        tag: (_, args) => tagService.getById(args.id),
        tags: () => tagService.getAll(),
    },
    Mutation: {
        createTodo: (_, { todo, tags }) => {
            const todoDoc = {
                t: todo,
                tg: tags,
            };
            return todoService.create(todoDoc);
        },
    },
    Todo: {
        tags: todo => todo.tags.map(t => tagService.getById(t)),
    },
};

module.exports = resolvers;
