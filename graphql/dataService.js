import fetch from 'node-fetch';

const BASE_URL = 'http://swapi.co/api';

function getJSONFromRelativeURL(relativeURL) {
  console.log('GET RELATIVE', relativeURL);
  return fetch(`${BASE_URL}${relativeURL}?format=json`)
    .then(res => res.json());
}

function getJSONFromAbsoluteURL(absoluteUrl) {
  console.log('GET ABSOLUTE', absoluteUrl);
  return fetch(`${absoluteUrl}?format=json`)
    .then(res => res.json());
}

function getFilms() {
  return getJSONFromRelativeURL('/films/')
    .then(json => json.results);
}

function getFilm(id) {
  return getJSONFromRelativeURL(`/films/${id}/`);
}

function getFilmByURL(absoluteUrl) {
  return getJSONFromAbsoluteURL(absoluteUrl);
}

function getPeople() {
  return getJSONFromRelativeURL('/people/')
    .then(json => json.results);
}

function getPerson(id) {
  return getJSONFromRelativeURL(`/people/${id}/`);
}

function getPersonByUrl(absoluteUrl) {
  return getJSONFromAbsoluteURL(absoluteUrl);
}

export default {
  getFilms,
  getFilm,
  getFilmByURL,
  getPeople,
  getPerson,
  getPersonByUrl
}