//  STATUS:FETCH
//  ============

//  Action types.
export const STATUS_FETCH_REQUEST = 'STATUS_FETCH_REQUEST';
export const STATUS_FETCH_SUCCESS = 'STATUS_FETCH_SUCCESS';
export const STATUS_FETCH_FAILURE = 'STATUS_FETCH_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: STATUS_FETCH_REQUEST,
});
const success = status => ({
  status,
  type: STATUS_FETCH_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: STATUS_FETCH_FAILURE,
});

//  Request.
export default function fetchStatus (id, force, go, current, api) {

  //  We only want to fetch statuses that we don't already have. If we
  //  already have a status associated with this `id`, we do nothing.
  if (!force && current().getIn(['status', id])) {
    return;
  }

  //  The request.
  go(request, id);
  api.get(
    `/api/v1/statuses/${id}`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
