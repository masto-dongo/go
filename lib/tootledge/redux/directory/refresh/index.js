//  DIRECTORY:REFRESH
//  =================

//  Action types.
export const DIRECTORY_REFRESH_REQUEST = 'DIRECTORY_REFRESH_REQUEST';
export const DIRECTORY_REFRESH_SUCCESS = 'DIRECTORY_REFRESH_SUCCESS';
export const DIRECTORY_REFRESH_FAILURE = 'DIRECTORY_REFRESH_FAILURE';

const request = path => ({
  path,
  type: DIRECTORY_REFRESH_REQUEST,
});
const success = (path, domains) => ({
  domains,
  path,
  type: DIRECTORY_REFRESH_SUCCESS,
});
const failure = (path, error) => ({
  error,
  path,
  type: DIRECTORY_REFRESH_FAILURE,
});

//  Request.
export default function refreshCatalogue (path, go, current, api) {

  //  If our directory is still loading, we can't refresh yet.
  const directory = current().getIn(['directory', path]);
  if (directory && directory.get('isLoading')) {
    return;
  }

  //  If our directory already has some accounts, this gets the most
  //  recent one.
  const ids = directory ? directory.get('domains') : void 0;
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
