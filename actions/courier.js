import { relateAccount } from './account';

export const COURIER_UPDATE  = 'COURIER_UPDATE';

export const COURIER_REFRESH_REQUEST = 'COURIER_REFRESH_REQUEST';
export const COURIER_REFRESH_SUCCESS = 'COURIER_REFRESH_SUCCESS';
export const COURIER_REFRESH_FAILURE = 'COURIER_REFRESH_FAILURE';

export const COURIER_EXPAND_REQUEST = 'COURIER_EXPAND_REQUEST';
export const COURIER_EXPAND_SUCCESS = 'COURIER_EXPAND_SUCCESS';
export const COURIER_EXPAND_FAILURE = 'COURIER_EXPAND_FAILURE';

export const COURIER_CONNECTING = 'COURIER_CONNECTING';
export const COURIER_DISCONNECT = 'COURIER_DISCONNECT';

export const updateCourier = notification => (go, state, api) => {
  const settings = state.getIn('settings', 'web', 'courier');
  const references = status.reblog ? state.get('statuses').filter((status, id) => (id === notification.reblog.id || status.get('reblog') === notification.reblog.id)).map((_, id) => id) : [];

  go({
    notification,
    path,
    references,
    type: TIMELINE_UPDATE,
  });

  if (notification.type === 'follow') go(relateAccount(notification));
};

export const refreshCourier = () => (go, state, api) => {
  const courier = state.get('courier');

  if (courier.get('isLoading') || courier.get('online')) return;

  const ids = courier.get('notifications');
  const newestId = ids.size > 0 ? ids.first() : void 0;
  const params = {};

  if (newestId !== void 0) params.since_id = newestId;

  go(requestRefreshCourier());

  api.get('/api/v1/notifications', { params })
    .then(response => {
      go(successRefreshCourier(response.data.value, response.data.next));
      go(relateAccount(response.data.value.filter(notification => notification.type === 'follow').map(notification => notification.account.id)));
    }).catch(error => go(failureRefreshCourier(error)));
};

export const requestRefreshCourier = () => ({ type: COURIER_REFRESH_REQUEST });

export const successRefreshCourier = (notifications, next) => ({
  next,
  notifications,
  type: COURIER_REFRESH_SUCCESS,
});

export const failureRefreshCourier = error => ({
  error,
  type: COURIER_REFRESH_FAILURE,
});

export const expandCourier = () => (go, state, api) => {
  const courier = state.get('courier');

  if (courier.get('isLoading')) return;

  const ids = courier.get('notifications');
  const oldestId = ids.size > 0 ? ids.last() : void 0;
  const params = {};

  if (oldestId !== void 0) params.max_id = oldestId;
  params.limit = 10;

  go(requestExpandCourier());

  api.get('/api/v1/notifications', { params })
    .then(response => {
      go(successExpandCourier(response.data.value, response.data.next));
      go(relateAccount(response.data.value.filter(notification => notification.type === 'follow').map(notification => notification.account.id)));
    }).catch(error => go(failureExpandCourier(error)));
};

export const requestExpandTimeline = () => ({ type: TIMELINE_EXPAND_REQUEST });

export const successExpandTimeline = (notifications, next) => ({
  next,
  notifications,
  type: TIMELINE_EXPAND_SUCCESS,
});

export const failureExpandTimeline = error => ({
  error,
  type: TIMELINE_EXPAND_FAILURE,
});

export const connectingCourier = () => ({ type: COURIER_CONNECTING });

export const disconnectCourier = () => ({ type: COURIER_DISCONNECT });
