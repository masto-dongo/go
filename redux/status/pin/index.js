//  STATUS:PIN
//  ==========

//  Action types.
export const STATUS_PIN_REQUEST = 'STATUS_PIN_REQUEST';
export const STATUS_PIN_SUCCESS = 'STATUS_PIN_SUCCESS';
export const STATUS_PIN_FAILURE = 'STATUS_PIN_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: STATUS_PIN_REQUEST,
});
const success = status => ({
  status,
  type: STATUS_PIN_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: STATUS_PIN_FAILURE,
});

//  Request.
export default function pinStatus (id, go, current, api) {
  go(request, id);
  api.post(
    `/api/v1/statuses/${id}/pin`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
