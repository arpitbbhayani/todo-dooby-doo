const express = require('express');

const app = express();
const initializer = require('./inits');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

const exWithGraphqlSchema = require('./ex-with-graphql/schema');

const handlers = require('./handlers');

const publicRoutes = require('./routes/public');
const vanillaRoutes = require('./routes/ex-vanilla');
const exWithGrpahQLRoutes = require('./routes/ex-with-graphql');

/* Handlebars */
app.set('views', './dist/views/templates');
app.engine('handlebars', exphbs({
    defaultLayout: 'basic',
    layoutsDir: './dist/views/layouts',
    partialsDir: './dist/views/partials',
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('./dist/static'));
app.use(require('cookie-parser')());

function registerRoutes() {
    app.use('/', publicRoutes);
    app.use('/vanilla', vanillaRoutes);
    app.use('/ex-with-graphql', exWithGrpahQLRoutes);
    app.use('/ex-with-graphql/api', bodyParser.json(), graphqlExpress({ schema: exWithGraphqlSchema }));
    app.use('/ex-with-graphql/graphiql', graphiqlExpress({ endpointURL: '/ex-with-graphql/api' }));
}

initializer.init(app, () => {
    registerRoutes();

    app.use(handlers.notFoundHandler);

    app.use(handlers.todoErrorHandler);
    app.use(handlers.logError);
    app.use(handlers.mongoErrorHandler);
    app.use(handlers.errorHandler);

    const PORT = 8082;
    app.listen(PORT, () => {
        console.log(`todo listening on port ${PORT}!`);
    });
});

process.on('SIGINT', () => {
    process.exit(0);
});
