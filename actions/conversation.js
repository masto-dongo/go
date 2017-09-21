import { removeStatus } from './status';

export const CONVERSATION_FETCH_REQUEST = 'CONVERSATION_FETCH_REQUEST';
export const CONVERSATION_FETCH_SUCCESS = 'CONVERSATION_FETCH_SUCCESS';
export const CONVERSATION_FETCH_FAILURE = 'CONVERSATION_FETCH_FAILURE';

export const fetchConversation = id => (go, state, api) => {
  go(requestFetchConversation(id));
  api.get(`/api/v1/statuses/${id}/context`)
    .then(response => go(successFetchConversation(id, response.data.value.ancestors, response.data.value.descendants)))
    .catch(error => {
      if (error.response && error.response.status === 404) {
        go(removeStatus(id));
      }
      go(failureFetchConversation(id, error));
    });
};

export const requestFetchConversation = id => ({
  id,
  type: CONVERSATION_FETCH_REQUEST,
});

export const successFetchConversation = (id, ancestors, descendants) => ({
  ancestors,
  descendants,
  id,
  type: CONVERSATION_FETCH_SUCCESS,
});

export const failureFetchConversation = (id, error) => ({
  error,
  id,
  type: CONVERSATION_FETCH_FAILURE,
});
