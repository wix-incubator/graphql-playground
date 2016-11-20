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
    .then(films => limitCharacterCountInFilms(films, charCount))
    .then(films => includeCharactersToFilms(loaders, films, charCount))
    ;
}

function limitCharacterCountInFilms(films, charCount) {
  return map(films, film => {
    const characters = film.characters.slice(0, charCount);
    return {...film, characters};
  });
}

function includeCharactersToFilms(loaders, films) {
  const charsToGet = map(films, film => film.characters);
  const charsPromises = map(charsToGet, charUrls => loaders.film.loadByUrl(charUrls));

  return Promise.all(charsPromises)
    .then(resolvedCharacters => combineCharsToFilms(flatten(resolvedCharacters), films));
}

function combineCharsToFilms(allCharacters, films) {
  return map(films, (film, filmIndex) => {
    let characterUrls = film.characters;

    const characters = map(characterUrls, (characterUrl, charIndex) => {
      return find(allCharacters, char => char.url === characterUrl)
    });

    return {...film, characters};
  });
}
