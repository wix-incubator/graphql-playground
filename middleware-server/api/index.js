const express = require('express');
const router = express.Router();
import dataLoaders from '../services/dataLoaders';
import { each, map, find } from 'lodash';

router.get('/allFilms', function (req, res) {

  getFilmList(dataLoaders)
   .then(films => res.json(films))
   .catch(e => res.json(e));
});

export default router;

function getFilmList(loaders) {
  return loaders.film.loadAll()
    .then(films => includeCharactersToFilms(loaders, films))
    ;
}

function includeCharactersToFilms(loaders, films) {
  return films;
}
