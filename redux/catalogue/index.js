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
}

//  Action types.
import { CATALOGUE_EXPAND_SUCCESS } from 'mastodon-go/redux/catalogue/expand';
import { CATALOGUE_FETCH_SUCCESS } from 'mastodon-go/redux/catalogue/fetch';
import { CATALOGUE_REFRESH_SUCCESS } from 'mastodon-go/redux/catalogue/refresh';

//  * * * * * * *  //

//  Setup
//  -----

//  `normalize()` normalizes the given array of `accounts` into a
//  proper catalogue. We only store the `ids` of the `accounts`.
const normalize = (accounts, path) => ImmutableMap({
  accounts: ImmutableList(accounts ? accounts.map(
    account => account.id
  ) : []),
  path,
});

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is just an empty Immutable map. Catalogues will
//  be added to this by `path`.
const initialState = ImmutableMap();

//  `set()` creates an entirely new catalogue and assigns it to the
//  appropriate `path` in our state, populating it with the provided
//  `accounts`. It overwrites any existing catalogue at that location.
const set = (state, path, accounts) => state.set(path, normalize(accounts, path));

//  `prepend()` prepends the `id`s of the provided `accounts` to the
//  catalogue at the given `path`. If no catalogue is at that location,
//  it functions exactly like `set()`.
const prepend = (state, path, accounts) => state.get(path) ? state.updateIn(
  [path, 'accounts'],
  list => accounts.map(
    account => account.id
  ).concat(list)
) : set(state, path, accounts);

//  `append()` appends the `id`s of the provided `accounts` to the
//  catalogue at the given `path`. If no catalogue is at that location,
//  it functions exactly like `set()`.
const append = (state, path, accounts) => state.get(path) ? state.updateIn(
  [path, 'accounts'],
  list => list.concat(accounts.map(
    account => account.id
  ))
) : set(state, path, accounts);

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function catalogue (state = initialState, action) {
  switch (action.type) {
  case CATALOGUE_EXPAND_SUCCESS:
    return append(state, action.path, action.accounts);
  case CATALOGUE_FETCH_SUCCESS:
    return set(state, action.path, action.accounts);
  case CATALOGUE_REFRESH_SUCCESS:
    return prepend(state, action.path, action.accounts);
  default:
    return state;
  }
}

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export { expandCatalogue } from './expand';
export { fetchCatalogue } from './fetch';
export { refreshCatalogue } from './refresh';
