import DataLoader from 'dataloader';
import DataService from './dataService';

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

export default {
  person: personLoader,
  film: filmLoader
}