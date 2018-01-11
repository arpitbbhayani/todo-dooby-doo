const resolvers = require('./resolvers');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
    type Tag {
        id: String
        name: String
        color: String
        todos: [Todo]
    }

    type Todo {
        id: String
        todo: String
        created_at: String
        is_complete: Boolean
        tags: [Tag]
    }

    type Query {
        todos(is_complete: Boolean!, limit: Int): [Todo]
        todo(id: String): Todo
        tags: [Tag]
        tagById(id: String): Tag
        tagByName(name: String): Tag
    }

    type Mutation {
        createTodo(todo: String!, tags: [String]): Todo
        createTag(name: String!, color: String): Tag
    }
`;

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

module.exports = schema;
