//  STATUS:REBLOG
//  =============

//  Action types.
export const STATUS_REBLOG_REQUEST = 'STATUS_REBLOG_REQUEST';
export const STATUS_REBLOG_SUCCESS = 'STATUS_REBLOG_SUCCESS';
export const STATUS_REBLOG_FAILURE = 'STATUS_REBLOG_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: STATUS_REBLOG_REQUEST,
});
const success = status => ({
  status,
  type: STATUS_REBLOG_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: STATUS_REBLOG_FAILURE,
});

//  Request.
export const reblogStatus = (id, go, state, api) => {
  go(request, id);
  api.get(
    `/api/v1/statuses/${id}/reblog`
  ).then(
    response => go(success, response.data.value)
  ).catch(
    error => go(failure, id, error)
  );
};
