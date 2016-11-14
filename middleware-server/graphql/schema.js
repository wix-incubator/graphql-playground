import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
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
    description: {
      type: GraphQLString,
      resolve: (film) => film.opening_crawl,
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
      type: new GraphQLList(CharacterType),
      args: {
        first: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve: (film, args, {loaders}) => {
        const firstChars = film.characters.slice(0, args.first);
        return loaders.person.loadByUrl(firstChars);
      }
    }
  }),
});

const CharacterType = new GraphQLObjectType({
  name: 'Character',
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
  fields: () => ({
    allFilms: {
      type: new GraphQLList(FilmType),
      resolve: (root, args, {loaders}) => loaders.film.loadAll(),
    },

    // these aren't used
    character: {
      type: CharacterType,
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