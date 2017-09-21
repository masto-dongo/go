export const NOTIFICATION_REMOVE = 'NOTIFICATION_REMOVE';

export const NOTIFICATION_FETCH_REQUEST = 'NOTIFICATION_FETCH_REQUEST';
export const NOTIFICATION_FETCH_SUCCESS = 'NOTIFICATION_FETCH_SUCCESS';
export const NOTIFICATION_FETCH_FAILURE = 'NOTIFICATION_FETCH_FAILURE';

export const NOTIFICATION_DELETE_REQUEST = 'NOTIFICATION_MULTIPLE_DELETE_REQUEST';
export const NOTIFICATION_DELETE_SUCCESS = 'NOTIFICATION_MULTIPLE_DELETE_SUCCESS';
export const NOTIFICATION_DELETE_FAILURE = 'NOTIFICATION_MULTIPLE_DELETE_FAILURE';

export const NOTIFICATION_CLEAR_REQUEST = 'NOTIFICATION_CLEAR_REQUEST';
export const NOTIFICATION_CLEAR_SUCCESS = 'NOTIFICATION_CLEAR_SUCCESS';
export const NOTIFICATION_CLEAR_FAILURE = 'NOTIFICATION_CLEAR_FAILURE';

export const removeNotification = ids => ({
  ids,
  type: NOTIFICATION_REMOVE,
});

export const fetchNotification = id => (go, state, api) => {
  go(requestFetchNotification(id));
  api.get(`/api/v1/notifications/${id}`)
    .then(response => go(successFetchNotification(response.data.value)))
    .catch(error => go(failureFetchNotification(id, error)));
};

export const requestFetchNotification = id => ({
  id,
  type: NOTIFICATION_FETCH_REQUEST,
});

export const successFetchNotification = item => ({
  item,
  type: NOTIFICATION_FETCH_SUCCESS,
});

export const failureFetchNotification = (id, error) => ({
  error,
  id,
  type: NOTIFICATION_FETCH_FAILURE,
});

export const deleteNotification = ids => (go, state, api) => {
  go(requestDeleteNotification(ids));
  api.post(ids instanceof Array ? `/api/v1/notifications/destroy_multiple?ids[]=${ids.join('&ids[]=')}` : `/api/v1/notifications/dismiss?id=${id}`)
    .then(() => {
      go(removeNotification(ids));
      go(successDeleteNotification(ids));
    }).catch(error => go(failureDeleteNotification(ids, error)));
};

export const requestDeleteNotification = ids => ({
  ids,
  type: NOTIFICATION_DELETE_REQUEST,
});

export const successDeleteNotification = ids => ({
  ids,
  type: NOTIFICATION_DELETE_SUCCESS,
});

export const failureDeleteNotification = (ids, error) => ({
    error,
    ids,
    type: NOTIFICATION_MULTIPLE_DELETE_FAILURE,
});

export const clearNotification = () => (go, state, api) => {
  go(requestClearNotification());
  api.post('/api/v1/notifications/clear')
    .then(() => {
      go(removeNotification(state.get('notification').keySeq().toArray()));
      go(successClearNotification());
    }).catch(error => go(failureClearNotification(error)));
};

export const requestClearNotification = () => ({ type: NOTIFICATION_CLEAR_REQUEST });

export const successClearNotification = () => ({ type: NOTIFICATION_CLEAR_SUCCESS });

export const failureClearNotification = error => ({
  error,
  type: NOTIFICATION_CLEAR_FAILURE,
});
