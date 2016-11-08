import DataLoader from 'dataloader';
import DataService from './dataService';

const filmCache = new Map();
const personCache = new Map();

const peopleLoader =
  new DataLoader(keys => Promise.all(keys.map(DataService.getPeople)));

const personLoader =
  new DataLoader(keys => Promise.all(keys.map(DataService.getPerson)), {
    cacheKeyFn: key => `${DataService.BASE_URL}/people/${key}/`,
    cacheMap: personCache
  });

const personByUrlLoader =
  new DataLoader(keys => Promise.all(keys.map(DataService.getPersonByUrl)), {
    cacheMap: personCache
  });

const filmsLoader =
  new DataLoader(keys => Promise.all(keys.map(DataService.getFilms)));

const filmLoader =
  new DataLoader(keys => Promise.all(keys.map(DataService.getFilm)), {
    cacheKeyFn: key => `${DataService.BASE_URL}/films/${key}/`,
    cacheMap: filmCache
  });

const filmByURLLoader =
  new DataLoader(keys => Promise.all(keys.map(DataService.getFilmByURL)), {
    cacheMap: filmCache
  });

personLoader.loadAll = peopleLoader.load.bind(peopleLoader, '__all__');
personLoader.loadByUrl = personByUrlLoader.loadMany.bind(personByUrlLoader);

filmLoader.loadAll = filmsLoader.load.bind(filmsLoader, '__all__');
filmLoader.loadByUrl = filmByURLLoader.loadMany.bind(filmByURLLoader);

export default {
  person: personLoader,
  film: filmLoader
}