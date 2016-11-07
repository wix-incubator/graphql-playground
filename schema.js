import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
} from 'graphql-relay';

const {
  nodeField,
  nodeInterface,
} = nodeDefinitions(
  // A method that maps from a global id to an object
  (globalId, {loaders}) => {
    const {id, type} = fromGlobalId(globalId);
    if (type === 'Film') {
      return loaders.films.load(id);
    }
  },
  // A method that maps from an object to a type
  (obj) => {
    if (obj.hasOwnProperty('title')) {
      return FilmType;
    }
  }
);

const FilmType = new GraphQLObjectType({
  name: 'Film',
  fields: () => ({
    id: globalIdField('Film'),
    title: {
      type: GraphQLString,
    },
    opening_crawl: {
      type: GraphQLString,
    },
    director: {
      type: GraphQLString,
    },
    producer: {
      type: GraphQLString,
    },
    release_date: {
      type: GraphQLString,
    }
  }),
  interfaces: [nodeInterface],
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: nodeField,
    allFilms: {
      type: new GraphQLList(FilmType),
      resolve: (root, args, {loaders}) => loaders.films.loadAll(),
    },
    film : {
      type: FilmType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: (root, args, {loaders}) => loaders.films.load(args.id),
    }
  }),
});

export default new GraphQLSchema({
  query: QueryType,
});