import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable'

import {
  CATALOGUE_REFRESH_SUCCESS,
  CATALOGUE_EXPAND_SUCCESS,
} from 'mastodon-go/actions/catalogue';

const initialList = path => ImmutableMap({
  accounts: ImmutableList(),
  path,
});

const initialState = ImmutableMap();

const normalizeList = (path, accounts) => ImmutableMap({
  accounts: ImmutableList(accounts.map(account => account.id)),
  path,
});

const setCatalogue = (state, path, accounts) => state.set(
  path,
  initialList().update(
    'accounts',
    list => list.concat(accounts.map(
      account => account.id
    ))
  )
);

const prependCatalogue = (state, path, accounts) => state.update(
  path, initialList(path),
  map => map.update(
    'accounts',
    list => accounts.map(
      account => account.id
    ).concat(list)
  )
);

const appendCatalogue = (state, path, accounts) => state.update(
  path, initialList(path),
  map => map.update(
    'accounts',
    list => list.concat(accounts.map(
      account => account.id
    ))
  )
);

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
