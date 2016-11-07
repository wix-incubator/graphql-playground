import DataLoader from 'dataloader';

import express from 'express';
import fetch from 'node-fetch';
import graphqlHTTP from 'express-graphql';
import schema from './schema';

const BASE_URL = 'http://swapi.co/api';

function getJSONFromRelativeURL(relativeURL) {
  return fetch(`${BASE_URL}${relativeURL}?format=json`)
    .then(res => res.json());
}

function getFilms() {
  return getJSONFromRelativeURL('/films/')
    .then(json => json.results);
}

function getFilm(id) {
  return getJSONFromRelativeURL(`/films/${id}/`);
}

function getFilmByURL(relativeURL) {
  return getJSONFromRelativeURL(relativeURL);
}

const app = express();

app.use(graphqlHTTP(req => {
  const cacheMap = new Map();

  const filmsLoader =
    new DataLoader(keys => Promise.all(keys.map(getFilms)), {cacheMap});

  const filmLoader =
    new DataLoader(keys => Promise.all(keys.map(getFilm)), {
      cacheKeyFn: key => `/films/${key}/`,
      cacheMap,
    });

  const filmByURLLoader =
    new DataLoader(keys => Promise.all(keys.map(getFilmByURL)), {cacheMap});

  filmLoader.loadAll = filmsLoader.load.bind(filmsLoader, '__all__');
  filmLoader.loadByUrl = filmByURLLoader.load.bind(filmByURLLoader);

  const loaders = {
    films: filmLoader
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