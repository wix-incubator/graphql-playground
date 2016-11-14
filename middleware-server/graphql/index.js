import graphqlHTTP from 'express-graphql';
import schema from './schema';
import dataLoaders from '../services/dataLoaders';

export default graphqlHTTP(req => {
  return {
    context: {loaders: dataLoaders},
    graphiql: true,
    schema,
  };
});