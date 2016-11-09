import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

const FilmType = new GraphQLObjectType({
  name: 'Film',
  fields: () => ({
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
});

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
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
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
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