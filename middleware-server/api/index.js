const express = require('express');
const router = express.Router();
import dataLoaders from '../services/dataLoaders';
import { each, map, flatten, find } from 'lodash';

const DEFAULT_CHAR_COUNT = 3;

router.get('/allFilms', function (req, res) {
  const charCount = req.query.charCount || DEFAULT_CHAR_COUNT;

  getFilmList(dataLoaders, charCount)
   .then(films => res.json(films))
   .catch(e => res.json(e));
});

export default router;

function getFilmList(loaders, charCount) {
  return loaders.film.loadAll()
    .then(films => includeCharactersToFilms(loaders, films, charCount))
    ;
}

function includeCharactersToFilms(loaders, films, charCount) {
  const charsToGet = map(films, film => film.characters.slice(0, charCount));
  const charsPromises = map(charsToGet, charUrls => loaders.film.loadByUrl(charUrls));

  return Promise.all(charsPromises)
    .then(resolvedCharacters => combineCharsToFilms(charCount, flatten(resolvedCharacters), films));
}

function combineCharsToFilms(charCount, allCharacters, films) {
  return map(films, (film, filmIndex) => {
    let characterUrls = film.characters.slice(0, charCount);

    const charList = map(characterUrls, (characterUrl, charIndex) => {
      return find(allCharacters, char => char.url === characterUrl)
    });

    film.characters = charList;
    return film;
  });
}
