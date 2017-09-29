//  STATUS:MUTE
//  ===========

//  Action types.
export const STATUS_MUTE_REQUEST = 'STATUS_MUTE_REQUEST';
export const STATUS_MUTE_SUCCESS = 'STATUS_MUTE_SUCCESS';
export const STATUS_MUTE_FAILURE = 'STATUS_MUTE_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: STATUS_MUTE_REQUEST,
});
const success = status => ({
  status,
  type: STATUS_MUTE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: STATUS_MUTE_FAILURE,
});

//  Request.
export const muteStatus = (id, go, current, api) => {
  go(request, id);
  api.get(
    `/api/v1/statuses/${id}/mute`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
};
