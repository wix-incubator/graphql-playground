import DataLoader from 'dataloader';

import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema';
import DataService from './dataService';

const app = express();

app.use(graphqlHTTP(req => {
  const peopleLoader =
    new DataLoader(keys => Promise.all(keys.map(DataService.getPeople)));

  const personLoader =
    new DataLoader(keys => Promise.all(keys.map(DataService.getPerson)), {
      cacheKeyFn: key => `/people/${key}/`,
    });

  const personByUrlLoader =
    new DataLoader(keys => Promise.all(keys.map(DataService.getPersonByUrl)));

  const filmsLoader =
    new DataLoader(keys => Promise.all(keys.map(DataService.getFilms)));

  const filmLoader =
    new DataLoader(keys => Promise.all(keys.map(DataService.getFilm)), {
      cacheKeyFn: key => `/films/${key}/`,
    });

  const filmByURLLoader =
    new DataLoader(keys => Promise.all(keys.map(DataService.getFilmByURL)));

  personLoader.loadAll = peopleLoader.load.bind(peopleLoader, '__all__');
  personLoader.loadByUrl = personByUrlLoader.loadMany.bind(personByUrlLoader);

  filmLoader.loadAll = filmsLoader.load.bind(filmsLoader, '__all__');
  filmLoader.loadByUrl = filmByURLLoader.loadMany.bind(filmByURLLoader);

  const loaders = {
    films: filmLoader,
    person: personLoader,
  };
  return {
    context: {loaders},
    graphiql: true,
    schema,
  };
}));

app.listen(
  5000,
  () => console.log('GraphQL Server running at http://localhost:5000')
);