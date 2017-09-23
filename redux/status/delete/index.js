//  STATUS:DELETE
//  =============

//  Imported requests.
import { removeStatus } from 'mastodon-go/redux';

//  Action types.
export const STATUS_DELETE_REQUEST = 'STATUS_DELETE_REQUEST';
export const STATUS_DELETE_SUCCESS = 'STATUS_DELETE_SUCCESS';
export const STATUS_DELETE_FAILURE = 'STATUS_DELETE_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: STATUS_DELETE_REQUEST,
});
const success = id => ({
  id,
  type: STATUS_DELETE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: STATUS_DELETE_FAILURE,
});

//  Request.
export const deleteStatus = (id, go, state, api) => {
  go(request, id);
  api.delete(
    `/api/v1/statuses/${id}`
  ).then(
    response => {
      go(success, id);
      go(removeStatus, id);
    }
  ).catch(
    error => go(failure, id, error)
  );
};
