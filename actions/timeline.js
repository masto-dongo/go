export const TIMELINE_UPDATE  = 'TIMELINE_UPDATE';

export const TIMELINE_REFRESH_REQUEST = 'TIMELINE_REFRESH_REQUEST';
export const TIMELINE_REFRESH_SUCCESS = 'TIMELINE_REFRESH_SUCCESS';
export const TIMELINE_REFRESH_FAILURE = 'TIMELINE_REFRESH_FAILURE';

export const TIMELINE_EXPAND_REQUEST = 'TIMELINE_EXPAND_REQUEST';
export const TIMELINE_EXPAND_SUCCESS = 'TIMELINE_EXPAND_SUCCESS';
export const TIMELINE_EXPAND_FAILURE = 'TIMELINE_EXPAND_FAILURE';

export const TIMELINE_CONNECTING = 'TIMELINE_CONNECTING';
export const TIMELINE_DISCONNECT = 'TIMELINE_DISCONNECT';

export const updateTimeline = (path, status) => (go, state, api) => {
    const settings = state.getIn('settings', 'web', 'timeline', timeline);
    const references = status.reblog ? state.get('statuses').filter((item, id) => (id === item.reblog.id || item.get('reblog') === item.reblog.id)).map((_, id) => id) : [];

    go({
      path,
      references,
      status,
      type: TIMELINE_UPDATE,
    });
  };
};

export const refreshTimeline = path => (go, state, api) => {
  const timeline = state.getIn(['timeline', path]);

  if (timeline && (timeline.get('isLoading') || timeline.get('online'))) return;

  const ids = timeline.get('items');
  const newestId = ids && ids.size > 0 ? ids.first() : void 0;
  const params = {};

  if (newestId !== void 0) params.since_id = newestId;

  go(requestRefreshTimeline(path));

  api.get(path, { params })
    .then(response => go(successRefreshTimeline(path, response.data.value, response.data.next)))
    .catch(error => go(failureRefreshTimeline(path, error)));
};

export const requestRefreshTimeline = path => ({
  path,
  type: TIMELINE_REFRESH_REQUEST,
});

export const successRefreshTimeline = (path, statuses, next) => ({
  next,
  path,
  statuses,
  type: TIMELINE_REFRESH_SUCCESS,
});

export const failureRefreshTimeline = (path, error) => ({
  error,
  path,
  type: TIMELINE_REFRESH_FAILURE,
});

export const expandTimeline = path => (go, state, api) => {
  const timeline = state.getIn(['timeline', path]);

  if (timeline && timeline.get('isLoading')) return;

  const ids = timeline ? timeline.get('accounts') : void 0;
  const oldestId = ids && ids.size > 0 ? ids.last() : void 0;
  const params = {};

  if (oldestId !== void 0) params.max_id = oldestId;
  params.limit = 10;

  go(requestExpandTimeline(path));

  api.get(path, { params })
    .then(response => go(successExpandTimeline(path, response.data.value, response.data.next)))
    .catch(error => go(failureExpandTimeline(path, error)));
};

export const requestExpandTimeline = path => ({
  path,
  type: TIMELINE_EXPAND_REQUEST,
});

export const successExpandTimeline = (path, statuses, next) => ({
  next,
  path,
  statuses,
  type: TIMELINE_EXPAND_SUCCESS,
});

export const failureExpandTimeline = (path, error) => ({
  error,
  path,
  type: TIMELINE_EXPAND_FAILURE,
});

export const connectingTimeline = path => ({
  path,
  type: TIMELINE_CONNECTING,
});

export const disconnectTimeline = path => ({
  path,
  type: TIMELINE_DISCONNECT,
});
