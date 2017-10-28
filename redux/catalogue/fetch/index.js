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
const success = (path, accounts, prev, next) => ({
  accounts,
  next,
  path,
  prev,
  type: CATALOGUE_FETCH_SUCCESS,
});
const failure = (path, error) => ({
  error,
  path,
  type: CATALOGUE_FETCH_FAILURE,
});

//  Request.
export default function fetchCatalogue (path, go, current, api) {

  //  If our catalogue is still loading, we can't fetch yet.
  const catalogue = current().getIn(['catalogue', path]);
  if (catalogue && catalogue.get('isLoading')) {
    return;
  }

  //  The request.
  go(request, path);
  api.get(path).then(function ({
    data,
    headers: { link },
  }) {
    const next = (link.match(/<\s*([^,]*)\s*>\s*;(?:[^,]*[;\s])?rel="?next"?/) || [])[1];
    const prev = (link.match(/<\s*([^,]*)\s*>\s*;(?:[^,]*[;\s])?rel="?prev(?:ious)?"?/) || [])[1];
    go(success, path, data, prev, next);
  }).catch(function (error) {
    go(failure, path, error)
  });
}
