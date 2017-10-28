//  CATALOGUE:REFRESH
//  =================

//  Action types.
export const CATALOGUE_REFRESH_REQUEST = 'CATALOGUE_REFRESH_REQUEST';
export const CATALOGUE_REFRESH_SUCCESS = 'CATALOGUE_REFRESH_SUCCESS';
export const CATALOGUE_REFRESH_FAILURE = 'CATALOGUE_REFRESH_FAILURE';

const request = path => ({
  path,
  type: CATALOGUE_REFRESH_REQUEST,
});
const success = (path, accounts, prev, next) => ({
  accounts,
  next,
  path,
  prev,
  type: CATALOGUE_REFRESH_SUCCESS,
});
const failure = (path, error) => ({
  error,
  path,
  type: CATALOGUE_REFRESH_FAILURE,
});

//  Request.
export default function refreshCatalogue (path, go, current, api) {

  //  If our catalogue is still loading, we can't refresh yet.
  const catalogue = current().getIn(['catalogue', path]);
  if (catalogue && catalogue.get('isLoading')) {
    return;
  }

  //  If we were provided a link header in our last request, we can
  //  use it.
  const linkPath = catalogue && catalogue.get('prev');

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
