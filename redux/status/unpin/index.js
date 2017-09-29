//  STATUS:UNPIN
//  ============

//  Action types.
export const STATUS_UNPIN_REQUEST = 'STATUS_UNPIN_REQUEST';
export const STATUS_UNPIN_SUCCESS = 'STATUS_UNPIN_SUCCESS';
export const STATUS_UNPIN_FAILURE = 'STATUS_UNPIN_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: STATUS_UNPIN_REQUEST,
});
const success = status => ({
  status,
  type: STATUS_UNPIN_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: STATUS_UNPIN_FAILURE,
});

//  Request.
export const unpinStatus = (id, go, current, api) => {
  go(request, id);
  api.get(
    `/api/v1/statuses/${id}/unpin`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
};
