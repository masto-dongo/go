//  reducers/catalogue
//  ==================

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable'

//  Our imports.
import {
  CATALOGUE_FETCH_SUCCESS,
  CATALOGUE_REFRESH_SUCCESS,
  CATALOGUE_EXPAND_SUCCESS,
} from 'mastodon-go/actions/catalogue';

//  * * * * * * *  //

//  Helper functions
//  ----------------

//  `initialCatalogue()` provides the initial state for every
//  catalogue. The `accounts` of a catalogue are just a list of ids.
const initialCatalogue = path => ImmutableMap({
  accounts: ImmutableList(),
  path,
});

//  * * * * * * *  //

//  State handling
//  --------------

//  Our `initialState` is just an empty Immutable map. Catalogues will
//  be added to this by `path`.
const initialState = ImmutableMap();

//  `setCatalogue()` creates an entirely new catalogue and assigns it
//  to the appropriate `path` in our state, populating it with the
//  provided `accounts`. It overwrites any existing catalogue at that
//  location.
const setCatalogue = (state, path, accounts) => state.set(
  path,
  initialCatalogue(path).update(
    'accounts',
    list => list.concat(accounts.map(
      account => account.id
    ))
  )
);

//  `prependCatalogue()` prepends the `id`s of the provided `accounts`
//  to the catalogue at the given `path`. If no catalogue is at that
//  location, it first creates one.
const prependCatalogue = (state, path, accounts) => state.update(
  path, initialCatalogue(path),
  map => map.update(
    'accounts',
    list => accounts.map(
      account => account.id
    ).concat(list)
  )
);

//  `appendCatalogue()` appends the `id`s of the provided `accounts` to
//  the catalogue at the given `path`. If no catalogue is at that
//  location, it first creates one.
const appendCatalogue = (state, path, accounts) => state.update(
  path, initialCatalogue(path),
  map => map.update(
    'accounts',
    list => list.concat(accounts.map(
      account => account.id
    ))
  )
);

//  * * * * * * *  //

//  Action reducing
//  ---------------

export default function catalogue (state = initialState, action) {
  switch (action.type) {
  case CATALOGUE_FETCH_SUCCESS:
    return setCatalogue(state, action.path, action.accounts);
  case CATALOGUE_REFRESH_SUCCESS:
    return prependCatalogue(state, action.path, action.accounts);
  case CATALOGUE_EXPAND_SUCCESS:
    return appendCatalogue(state, action.path, action.accounts);
  }
}
