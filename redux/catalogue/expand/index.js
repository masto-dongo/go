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
const success = (path, accounts, prev, next) => ({
  accounts,
  next,
  path,
  prev,
  type: CATALOGUE_EXPAND_SUCCESS,
});
const failure = (path, error) => ({
  error,
  path,
  type: CATALOGUE_EXPAND_FAILURE,
});

//  Request.
export default function expandCatalogue (path, go, current, api) {

  //  If our catalogue is still loading, we can't expand yet.
  const catalogue = current().getIn(['catalogue', path]);
  if (catalogue && catalogue.get('isLoading')) {
    return;
  }

  //  If we were provided a link header in our last request, we can
  //  use it.
  const linkPath = catalogue && catalogue.get('next');

  //  The request.
  go(request, path);
  api.get(linkPath || path).then(function ({
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
