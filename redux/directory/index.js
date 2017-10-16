//  DIRECTORY
//  =========

//  A directory is a list of domains. The only directory Mastodon puts
//  out right now is the list of blocked domains, but the
//  infrastructure here is capable of handling any number of domain
//  lists.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable';

//  Requests.
import ensureDirectory from './ensure';
import expandDirectory from './expand';
import fetchDirectory from './fetch';
import refreshDirectory from './refresh';

//  Action types.
import { DIRECTORY_ENSURE_MAKE } from 'themes/mastodon-go/redux/directory/ensure';
import {
  DIRECTORY_EXPAND_FAILURE,
  DIRECTORY_EXPAND_REQUEST,
  DIRECTORY_EXPAND_SUCCESS,
} from 'themes/mastodon-go/redux/directory/expand';
import {
  DIRECTORY_FETCH_FAILURE,
  DIRECTORY_FETCH_REQUEST,
  DIRECTORY_FETCH_SUCCESS,
} from 'themes/mastodon-go/redux/directory/fetch';
import {
  DIRECTORY_REFRESH_FAILURE,
  DIRECTORY_REFRESH_REQUEST,
  DIRECTORY_REFRESH_SUCCESS,
} from 'themes/mastodon-go/redux/directory/refresh';

//  Other imports.
import rainbow from 'themes/mastodon-go/util/rainbow';

//  * * * * * * *  //

//  Setup
//  -----

//  `normalize()` normalizes the given array of `domains` into a
//  proper directory.
const normalize = domains => ImmutableList(domains ? domains.map(
  domain => '' + domain
) : []);

//  `makeDirectory()` creates a normalized directory from a list of
//  `domains`.
const makeDirectory = (path, domains) => ImmutableMap({
  accounts: normalize(domains),
  isLoading: false,
  path: '' + path,
});

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is just an empty Immutable map. Directories will
//  be added to this by `path`.
const initialState = ImmutableMap();

//  `ensure()` ensures that a directory has been created for the given
//  `path`.
const ensure = (state, path) => state.get('' + path) ? state : state.set('' + path, makeDirectory(path));

//  `set()` replaces a directory's `domains` with a new `normalized()`
//  list.
const set = (state, path, domains) => state.withMutations(
  map => {

    //  We want to ensure our `path` is a string like it should be.
    path = '' + path;

    //  If no directory exists at the given path, we make one.
    if (!state.get(path)) {
      map.set(path, makeDirectory(path, domains));
      return;
    }

    //  Otherwise, we update its `domains`.
    map.setIn([path, 'isLoading'], false);
    map.setIn([path, 'domains'], normalize(domains));
  }
);

//  `prepend()` prepends the given `domains` to a directory.
const prepend = (state, path, domains) => state.withMutations(
  map => {

    //  We want to ensure our `path` is a string like it should be.
    path = '' + path;

    //  If no directory exists at the given path, we make one.
    if (!state.get(path)) {
      map.set(path, makeDirectory(path, domains));
      return;
    }

    //  Otherwise, we prepend the `domains`.
    map.setIn([path, 'isLoading'], false);
    map.updateIn(
      [path, 'domains'],
      (list = ImmutableList()) => normalize(domains).concat(list)
    );
  }
);

//  `append()` appends the given `domains` to a directory.
const append = (state, path, domains) => state.withMutations(
  map => {

    //  We want to ensure our `path` is a string like it should be.
    path = '' + path;

    //  If no directory exists at the given path, we make one.
    if (!state.get(path)) {
      map.set(path, makeDirectory(path, domains));
      return;
    }

    //  Otherwise, we prepend the `domains`.
    map.setIn([path, 'isLoading'], false);
    map.updateIn(
      [path, 'domains'],
      (list = ImmutableList()) => list.concat(normalize(domains))
    );
  }
);

//  `setLoading()` sets the loading state for our directory.
const setLoading = (state, path, value) => state.update(
  '' + path,
  (map = makeDirectory(path)) => map.set('isLoading', !!value)
);

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function directory (state = initialState, action) {
  switch (action.type) {
  case DIRECTORY_ENSURE_MAKE:
    return ensure(state, action.path);
  case DIRECTORY_EXPAND_FAILURE:
    return setLoading(state, action.path, false);
  case DIRECTORY_EXPAND_REQUEST:
    return setLoading(state, action.path, true);
  case DIRECTORY_EXPAND_SUCCESS:
    return append(state, action.path, action.domains);
  case DIRECTORY_FETCH_FAILURE:
    return setLoading(state, action.path, false);
  case DIRECTORY_FETCH_REQUEST:
    return setLoading(state, action.path, true);
  case DIRECTORY_FETCH_SUCCESS:
    return set(state, action.path, action.domains);
  case DIRECTORY_REFRESH_FAILURE:
    return setLoading(state, action.path, false);
  case DIRECTORY_REFRESH_REQUEST:
    return setLoading(state, action.path, true);
  case DIRECTORY_REFRESH_SUCCESS:
    return prepend(state, action.path, action.domains);
  default:
    return state;
  }
}

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export {
  ensureDirectory,
  expandDirectory,
  fetchDirectory,
  refreshDirectory,
};
