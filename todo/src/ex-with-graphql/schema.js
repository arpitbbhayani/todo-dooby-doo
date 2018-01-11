const resolvers = require('./resolvers');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
    type Todo {
        id: String
        todo: String
        created_at: String
        is_complete: Boolean
        tags: [String]
    }

    type Query {
        todos(is_complete: Boolean!, limit: Int): [Todo]
        todo(id: String): Todo
    }

    type Mutation {
        createTodo(todo: String!): Todo
    }
`;

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

module.exports = schema;
