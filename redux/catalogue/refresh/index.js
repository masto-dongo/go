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
const success = (path, accounts) => ({
  accounts,
  path,
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

  //  If our catalogue already has some accounts, this gets the most
  //  recent one.
  const ids = catalogue ? catalogue.get('accounts') : void 0;
  const newestId = ids && ids.size > 0 ? ids.first() : void 0;

  //  If we have an oldest id, then we can set it in our params.
  const params = {};
  if (newestId !== void 0) params.since_id = newestId;

  //  The request.
  go(request, path);
  api.get(
    path, { params }
  ).then(
    response => go(success, path, response.data)
  ).catch(
    error => go(failure, path, error)
  );
}
