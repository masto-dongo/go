//  DIRECTORY:EXPAND
//  ================

//  Action types.
export const DIRECTORY_EXPAND_REQUEST = 'DIRECTORY_EXPAND_REQUEST';
export const DIRECTORY_EXPAND_SUCCESS = 'DIRECTORY_EXPAND_SUCCESS';
export const DIRECTORY_EXPAND_FAILURE = 'DIRECTORY_EXPAND_FAILURE';

//  Action creators.
const request = path => ({
  path,
  type: DIRECTORY_EXPAND_REQUEST,
});
const success = (path, domains) => ({
  domains,
  path,
  type: DIRECTORY_EXPAND_SUCCESS,
});
const failure = (path, error) => ({
  error,
  path,
  type: DIRECTORY_EXPAND_FAILURE,
});

//  Request.
export default function expandDirectory (path, go, current, api) {

  //  If our directory is still loading, we can't expand yet.
  const directory = current().getIn(['directory', path]);
  if (directory && directory.get('isLoading')) {
    return;
  }

  //  If our directory already has some accounts, this gets the oldest
  //  one.
  const ids = directory ? directory.get('domains') : void 0;
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
}
