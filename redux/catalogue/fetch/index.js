//  CATALOGUE:FETCH
//  ===============

//  Action types.
export const CATALOGUE_FETCH_REQUEST = 'CATALOGUE_FETCH_REQUEST';
export const CATALOGUE_FETCH_SUCCESS = 'CATALOGUE_FETCH_SUCCESS';
export const CATALOGUE_FETCH_FAILURE = 'CATALOGUE_FETCH_FAILURE';

//  Action creators.
const request = path => ({
  path,
  type: CATALOGUE_FETCH_REQUEST,
});
const success = (path, accounts) => ({
  accounts,
  path,
  type: CATALOGUE_FETCH_SUCCESS,
});
const failure = (path, error) => ({
  error,
  path,
  type: CATALOGUE_FETCH_FAILURE,
});

//  Request.
export const fetchCatalogue = (path, go, current, api) => {

  //  If our catalogue is still loading, we can't fetch yet.
  const catalogue = current().getIn(['catalogue', path]);
  if (catalogue && catalogue.get('isLoading')) {
    return;
  }

  //  The request.
  go(request, path);
  api.get(
    path
  ).then(
    response => go(success, path, response.data)
  ).catch(
    error => go(failure, path, error)
  );
};
