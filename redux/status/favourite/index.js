//  STATUS:FAVOURITE
//  ================

//  Action types.
export const STATUS_FAVOURITE_REQUEST = 'STATUS_FAVOURITE_REQUEST';
export const STATUS_FAVOURITE_SUCCESS = 'STATUS_FAVOURITE_SUCCESS';
export const STATUS_FAVOURITE_FAILURE = 'STATUS_FAVOURITE_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: STATUS_FAVOURITE_REQUEST,
});
const success = status => ({
  status,
  type: STATUS_FAVOURITE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: STATUS_FAVOURITE_FAILURE,
});

//  Request.
export default function favouriteStatus (id, go, current, api) {
  go(request, id);
  api.get(
    `/api/v1/statuses/${id}/favourite`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
