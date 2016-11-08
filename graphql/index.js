import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema';
import dataLoaders from './dataLoaders';

const app = express();

app.use(graphqlHTTP(req => {
  return {
    context: {loaders: dataLoaders},
    graphiql: true,
    schema,
  };
}));

app.listen(
  5000,
  () => console.log('GraphQL Server running at http://localhost:5000')
);