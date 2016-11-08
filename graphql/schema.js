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
    if (type === 'Person') {
      return loaders.person.load(id);
    }
  },
  // A method that maps from an object to a type
  (obj) => {
    if (obj.hasOwnProperty('title')) {
      return FilmType;
    }
    if (obj.hasOwnProperty('name')) {
      return PersonType;
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
    },
    characters: {
      type: new GraphQLList(PersonType),
      resolve: (film, args, {loaders}) => loaders.person.loadByUrl(film.characters)
    }
  }),
  interfaces: [nodeInterface],
});

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    id: globalIdField('Person'),
    name: {
      type: GraphQLString,
    },
    height: {
      type: GraphQLString,
    },
    mass: {
      type: GraphQLString,
    },
    hair_color: {
      type: GraphQLString,
    },
    gender: {
      type: GraphQLString,
    },
    films: {
      type: new GraphQLList(FilmType),
      resolve: (person, args, {loaders}) => loaders.film.loadByUrl(person.films)
    }
  }),
  interfaces: [nodeInterface],
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: nodeField,
    allPeople: {
      type: new GraphQLList(PersonType),
      resolve: (root, args, {loaders}) => loaders.person.loadAll(),
    },
    allFilms: {
      type: new GraphQLList(FilmType),
      resolve: (root, args, {loaders}) => loaders.film.loadAll(),
    },
    person: {
      type: PersonType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: (root, args, {loaders}) => loaders.person.load(args.id),
    },
    film : {
      type: FilmType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve: (root, args, {loaders}) => loaders.film.load(args.id),
    }
  }),
});

export default new GraphQLSchema({
  query: QueryType,
});