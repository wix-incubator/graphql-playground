import express from 'express';
import graphqlMiddleware from './graphql/index';

const app = express();

app.use('/graphql', graphqlMiddleware);

app.listen(
  5000,
  () => console.log('Server running at http://localhost:5000')
);