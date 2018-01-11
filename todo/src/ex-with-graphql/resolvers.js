const todosService = require('../services/todos');

const resolvers = {
    Query: {
        todos: (_, args) => todosService.getAllByState(args.is_complete),
        todo: (_, args) => todosService.getById(args.id),
    },
    Mutation: {
        createTodo: (_, { todo }) => {
            const todoDoc = {
                t: todo,
            };
            return todosService.create(todoDoc);
        },
    },
};

module.exports = resolvers;
