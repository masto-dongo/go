//  CATALOGUE
//  =========

//  Upstream Mastodon calls these "user lists" which I find horribly
//  unimaginative. I've called them "rolodexes" before but these days
//  not everybody knows wtf a "rolodex" is. So I went with "catalogue".
//  They're like timelines, only for users.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable';

//  Requests.
import expandCatalogue from './expand';
import fetchCatalogue from './fetch';
import refreshCatalogue from './refresh';

//  Action types.
import {
  CATALOGUE_EXPAND_FAILURE,
  CATALOGUE_EXPAND_REQUEST,
  CATALOGUE_EXPAND_SUCCESS,
} from 'themes/mastodon-go/redux/catalogue/expand';
import {
  CATALOGUE_FETCH_FAILURE,
  CATALOGUE_FETCH_REQUEST,
  CATALOGUE_FETCH_SUCCESS,
} from 'themes/mastodon-go/redux/catalogue/fetch';
import {
  CATALOGUE_REFRESH_FAILURE,
  CATALOGUE_REFRESH_REQUEST,
  CATALOGUE_REFRESH_SUCCESS,
} from 'themes/mastodon-go/redux/catalogue/refresh';

//  * * * * * * *  //

//  Setup
//  -----

//  `normalize()` normalizes the given array of `accounts` into a
//  proper catalogue. We only store the `ids` of the `accounts`.
const normalize = accounts => ImmutableList(accounts ? accounts.map(
  account => '' + account.id
) : []);

//  `makeCatalogue()` creates a normalized catalogue from a list of
//  accounts.
const makeCatalogue = (path, accounts, prev, next) => ImmutableMap({
  accounts: normalize(accounts),
  isLoading: false,
  next: next ? '' + next : null,
  path: '' + path,
  prev: prev ? '' + prev : null,
});

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is just an empty Immutable map. Catalogues will
//  be added to this by `path`.
const initialState = ImmutableMap();

//  `set()` replaces a catalogues's `accounts` with a new `normalized()`
//  list.
const set = (state, path, accounts, prev, next) => state.withMutations(
  map => {

    //  We want to ensure our `path` is a string like it should be.
    path = '' + path;

    //  If no catalogue exists at the given path, we make one.
    if (!state.get(path)) {
      map.set(path, makeCatalogue(path, accounts, prev, next));
      return;
    }

    //  Otherwise, we update its `accounts`.
    map.setIn([path, 'isLoading'], false);
    map.setIn([path, 'accounts'], normalize(accounts));
    map.setIn([path, 'prev'], '' + prev);
    map.setIn([path, 'next'], '' + next);
  }
);

//  `prepend()` prepends the given `accounts` to a catalogue.
const prepend = (state, path, accounts, prev, next) => state.withMutations(
  map => {

    //  We want to ensure our `path` is a string like it should be.
    path = '' + path;

    //  If no catalogue exists at the given path, we make one.
    if (!state.get(path)) {
      map.set(path, makeCatalogue(path, accounts, prev, next));
      return;
    }

    //  Otherwise, we prepend the `accounts`.
    map.setIn([path, 'isLoading'], false);
    map.updateIn(
      [path, 'accounts'],
      (list = ImmutableList()) => normalize(accounts).concat(list)
    );
    map.setIn([path, 'prev'], '' + prev);
    map.setIn([path, 'next'], '' + next);
  }
);

//  `append()` appends the given `accounts` to a catalogue.
const append = (state, path, accounts, prev, next) => state.withMutations(
  map => {

    //  We want to ensure our `path` is a string like it should be.
    path = '' + path;

    //  If no catalogue exists at the given path, we make one.
    if (!state.get(path)) {
      map.set(path, makeCatalogue(path, accounts, prev, next));
      return;
    }

    //  Otherwise, we prepend the `accounts`.
    map.setIn([path, 'isLoading'], false);
    map.updateIn(
      [path, 'accounts'],
      (list = ImmutableList()) => list.concat(normalize(accounts))
    );
    map.setIn([path, 'prev'], '' + prev);
    map.setIn([path, 'next'], '' + next);
  }
);

//  `setLoading()` sets the loading state for our catalogue.
const setLoading = (state, path, value) => state.update(
  '' + path,
  (map = makeCatalogue(path)) => map.set('isLoading', !!value)
);

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function catalogue (state = initialState, action) {
  switch (action.type) {
  case CATALOGUE_EXPAND_FAILURE:
    return setLoading(state, action.path, false);
  case CATALOGUE_EXPAND_REQUEST:
    return setLoading(state, action.path, true);
  case CATALOGUE_EXPAND_SUCCESS:
    return append(state, action.path, action.accounts, action.prev, action.next);
  case CATALOGUE_FETCH_FAILURE:
    return setLoading(state, action.path, false);
  case CATALOGUE_FETCH_REQUEST:
    return setLoading(state, action.path, true);
  case CATALOGUE_FETCH_SUCCESS:
    return set(state, action.path, action.accounts, action.prev, action.next);
  case CATALOGUE_REFRESH_FAILURE:
    return setLoading(state, action.path, false);
  case CATALOGUE_REFRESH_REQUEST:
    return setLoading(state, action.path, true);
  case CATALOGUE_REFRESH_SUCCESS:
    return prepend(state, action.path, action.accounts, action.prev, action.next);
  default:
    return state;
  }
}

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export {
  expandCatalogue,
  fetchCatalogue,
  refreshCatalogue,
};
