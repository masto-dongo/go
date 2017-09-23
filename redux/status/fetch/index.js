//  STATUS:FETCH
//  ============

//  Imported reducers.
import {
  cardStatus,
  fetchConversation,
} from 'mastodon-go/redux';

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
export const fetchStatus = (id, go, state, api) => {

  //  Before we fetch our status (and regardless of whether or not we
  //  already have data on it), we first fetch its card and
  //  conversation, if possible.
  go(fetchConversation, id);
  go(cardStatus, id);

  //  We only want to fetch statuses that we don't already have. If we
  //  already have a status associated with this `id`, we do nothing.
  if (state.getIn(['status', id]) {
    return;
  }

  //  The request.
  go(request, id);
  api.get(
    `/api/v1/statuses/${id}`
  ).then(
    response => go(success, response.data.value)
  ).catch(
    error => go(failure, id, error)
  );
};
