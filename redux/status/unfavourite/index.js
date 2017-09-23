//  STATUS:UNFAVOURITE
//  ==================

//  Action types.
export const STATUS_UNFAVOURITE_REQUEST = 'STATUS_UNFAVOURITE_REQUEST';
export const STATUS_UNFAVOURITE_SUCCESS = 'STATUS_UNFAVOURITE_SUCCESS';
export const STATUS_UNFAVOURITE_FAILURE = 'STATUS_UNFAVOURITE_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: STATUS_UNFAVOURITE_REQUEST,
});
const success = status => ({
  status,
  type: STATUS_UNFAVOURITE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: STATUS_UNFAVOURITE_FAILURE,
});

//  Request.
export const unfavouriteStatus = (id, go, state, api) => {
  go(request, id);
  api.get(
    `/api/v1/statuses/${id}/unfavourite`
  ).then(
    response => go(success, response.data.value)
  ).catch(
    error => go(failure, id, error)
  );
};
