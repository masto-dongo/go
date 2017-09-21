import fetchConversation from './conversation';

export const STATUS_REMOVE = 'STATUS_REMOVE';

export const STATUS_FETCH_REQUEST = 'STATUS_FETCH_REQUEST';
export const STATUS_FETCH_SUCCESS = 'STATUS_FETCH_SUCCESS';
export const STATUS_FETCH_FAILURE = 'STATUS_FETCH_FAILURE';

export const STATUS_DELETE_REQUEST = 'STATUS_DELETE_REQUEST';
export const STATUS_DELETE_SUCCESS = 'STATUS_DELETE_SUCCESS';
export const STATUS_DELETE_FAILURE = 'STATUS_DELETE_FAILURE';

export const STATUS_MUTE_REQUEST = 'STATUS_MUTE_REQUEST';
export const STATUS_MUTE_SUCCESS = 'STATUS_MUTE_SUCCESS';
export const STATUS_MUTE_FAILURE = 'STATUS_MUTE_FAILURE';

export const STATUS_UNMUTE_REQUEST = 'STATUS_UNMUTE_REQUEST';
export const STATUS_UNMUTE_SUCCESS = 'STATUS_UNMUTE_SUCCESS';
export const STATUS_UNMUTE_FAILURE = 'STATUS_UNMUTE_FAILURE';

export const STATUS_CARD_REQUEST = 'STATUS_CARD_REQUEST';
export const STATUS_CARD_SUCCESS = 'STATUS_CARD_SUCCESS';
export const STATUS_CARD_FAILURE = 'STATUS_CARD_FAILURE';

export const removeStatus = id => (go, state) => {
  const references = state.get('status').filter(status => status.get('reblog') === id).map(status => status.get('id'));
  const reblogOf = state.getIn(['status', id, 'reblog'], null);

  go({
    id,
    reblogOf,
    references,
    type: STATUS_REMOVE,
  });
}

export const fetchStatus = id => (go, state, api) => {
  go(fetchConversation(id));
  go(cardStatus(id));

  if (state.getIn(['status', id])) return;

  go(requestFetchStatus(id));

  api.get(`/api/v1/statuses/${id}`)
    .then(response => go(successFetchStatus(response.data)))
    .catch(error => go(failureFetchStatus(id, error)));
};

export const requestFetchStatus = id => ({
  id,
  type: STATUS_FETCH_REQUEST,
});

export const successFetchStatus = item => ({
  item,
  type: STATUS_FETCH_SUCCESS,
});

export const failureFetchStatus = (id, error) => ({
  error,
  id,
  type: STATUS_FETCH_FAILURE,
});

export const deleteStatus = id => (go, state, api) => {
  go(requestDeleteStatus(id));

  api.delete(`/api/v1/statuses/${id}`)
    .then(() => {
      go(removeStatus(id));
      go(successDeleteStatus(id));
    }).catch(error => go(failureDeleteStatus(id, error)));
};

export const requestDeleteStatus = id => ({
  id,
  type: STATUS_DELETE_REQUEST,
});

export const successDeleteStatus = id => ({
  id,
  type: STATUS_DELETE_SUCCESS,
});

export const failureDeleteStatus = (id, error) => ({
  error,
  id,
  type: STATUS_DELETE_FAILURE,
});

export const muteStatus = id => (go, state, api) => {
  go(requestMuteStatus(id));
  api.post(`/api/v1/statuses/${id}/mute`)
    .then(() => go(successMuteStatus(id)))
    .catch(error => go(failureMuteStatus(id, error)));
};

export const requestMuteStatus = id => ({
  id,
  type: STATUS_MUTE_REQUEST,
});

export const successMuteStatus = id => ({
  id,
  type: STATUS_MUTE_SUCCESS,
});

export const failureMuteStatus = (id, error) => ({
  error,
  id,
  type: STATUS_MUTE_FAILURE,
});

export const unmuteStatus = id => {
  go(requestUnmuteStatus(id));

  api.post(`/api/v1/statuses/${id}/unmute`)
    .then(() => go(successUnmuteStatus(id)))
    .catch(error => go(failureUnmuteStatus(id, error)));
};

export const requestUnmuteStatus = id => ({
  id,
  type: STATUS_UNMUTE_REQUEST,
});

export const successUnmuteStatus = id => ({
  id,
  type: STATUS_UNMUTE_SUCCESS,
});

export const failureUnmuteStatus = (id, error) => ({
  error,
  id,
  type: STATUS_UNMUTE_FAILURE,
});

export const cardStatus = id => (go, state, api) => {
  if (state.getIn(['cards', id])) return;

  go(requestCardStatus(id));
  api.get(`/api/v1/statuses/${id}/card`)
    .then(response => {
    if (!response.data.url) return;
    go(successCardStatus(id, response.data.value));
  }).catch(error => go(failureCardStatus(id, error)));
};

export const requestCardStatus = id => ({
  id,
  type: STATUS_CARD_REQUEST,
});

export const successCardStatus = (id, card) => ({
  card,
  id,
  type: STATUS_CARD_SUCCESS,
});

export const fetchStatusCardFail = (id, error) => ({
  error,
  id,
  type: STATUS_CARD_FAIL,
});
