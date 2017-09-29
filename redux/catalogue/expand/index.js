//  CATALOGUE:EXPAND
//  ================

//  Action types.
export const CATALOGUE_EXPAND_REQUEST = 'CATALOGUE_EXPAND_REQUEST';
export const CATALOGUE_EXPAND_SUCCESS = 'CATALOGUE_EXPAND_SUCCESS';
export const CATALOGUE_EXPAND_FAILURE = 'CATALOGUE_EXPAND_FAILURE';

//  Action creators.
const request = path => ({
  path,
  type: CATALOGUE_EXPAND_REQUEST,
});
const success = (path, accounts) => ({
  accounts,
  path,
  type: CATALOGUE_EXPAND_SUCCESS,
});
const failure = (path, error) => ({
  error,
  path,
  type: CATALOGUE_EXPAND_FAILURE,
});

//  Request.
export const expandCatalogue = (path, go, current, api) => {

  //  If our catalogue is still loading, we can't expand yet.
  const catalogue = current().getIn(['catalogue', path]);
  if (catalogue && catalogue.get('isLoading')) {
    return;
  }

  //  If our catalogue already has some accounts, this gets the oldest
  //  one.
  const ids = catalogue ? catalogue.get('accounts') : void 0;
  const oldestId = ids && ids.size > 0 ? ids.last() : void 0;

  //  If we have an oldest id, then we can set it in our params.
  const params = { limit: 20 };
  if (oldestId !== void 0) params.max_id = oldestId;

  //  The request.
  go(request, path);
  api.get(
    path, { params }
  ).then(
    response => go(success, path, response.data)
  ).catch(
    error => go(failure, path, error)
  );
};
