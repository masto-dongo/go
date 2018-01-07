//  DIRECTORY:FETCH
//  ===============

//  Action types.
export const DIRECTORY_FETCH_REQUEST = 'DIRECTORY_FETCH_REQUEST';
export const DIRECTORY_FETCH_SUCCESS = 'DIRECTORY_FETCH_SUCCESS';
export const DIRECTORY_FETCH_FAILURE = 'DIRECTORY_FETCH_FAILURE';

//  Action creators.
const request = path => ({
  path,
  type: DIRECTORY_FETCH_REQUEST,
});
const success = (path, domains) => ({
  domains,
  path,
  type: DIRECTORY_FETCH_SUCCESS,
});
const failure = (path, error) => ({
  error,
  path,
  type: DIRECTORY_FETCH_FAILURE,
});

//  Request.
export default function fetchDirectory (path, go, current, api) {

  //  If our directory is still loading, we can't fetch yet.
  const directory = current().getIn(['directory', path]);
  if (directory && directory.get('isLoading')) {
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
}
