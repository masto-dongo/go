export const CATALOGUE_FETCH_REQUEST = 'CATALOGUE_FETCH_REQUEST';
export const CATALOGUE_FETCH_SUCCESS = 'CATALOGUE_FETCH_SUCCESS';
export const CATALOGUE_FETCH_FAILURE = 'CATALOGUE_FETCH_FAILURE';

export const CATALOGUE_REFRESH_REQUEST = 'CATALOGUE_REFRESH_REQUEST';
export const CATALOGUE_REFRESH_SUCCESS = 'CATALOGUE_REFRESH_SUCCESS';
export const CATALOGUE_REFRESH_FAILURE = 'CATALOGUE_REFRESH_FAILURE';

export const CATALOGUE_EXPAND_REQUEST = 'CATALOGUE_EXPAND_REQUEST';
export const CATALOGUE_EXPAND_SUCCESS = 'CATALOGUE_EXPAND_SUCCESS';
export const CATALOGUE_EXPAND_FAILURE = 'CATALOGUE_EXPAND_FAILURE';

export const refreshCatalogue = path => (go, state, api) => {
  const catalogue = state.getIn(['catalogue', path]);

  if (catalogue && catalogue.get('isLoading')) return;

  go(requestFetchCatalogue(path));
  api.get(path)
    .then(response => go(successFetchCatalogue(path, response.data.value, response.data.next)))
    .catch(error => go(failureFetchCatalogue(path, error)));
};

export const requestFetchCatalogue = path => ({
  path,
  type: CATALOGUE_FETCH_REQUEST,
});

export const successFetchCatalogue = (path, accounts, next) => ({
  accounts,
  next,
  path,
  type: CATALOGUE_FETCH_SUCCESS,
});

export const failureFetchCatalogue = (path, error) => ({
  error,
  path,
  type: CATALOGUE_FETCH_FAILURE,
});

export const refreshCatalogue = path => (go, state, api) => {
  const catalogue = state.getIn(['catalogue', path]);

  if (catalogue && catalogue.get('isLoading')) return;

  const ids = catalogue ? catalogue.get('accounts') : void 0;
  const newestId = ids && ids.size > 0 ? ids.first() : void 0;
  const params = {};

  if (newestId !== void 0) params.since_id = newestId;

  go(requestRefreshCatalogue(path));
  api.get(path, { params })
    .then(response => go(successRefreshCatalogue(path, response.data.value, response.data.next)))
    .catch(error => go(failureRefreshCatalogue(path, error)));
};

export const requestRefreshCatalogue = path => ({
  path,
  type: CATALOGUE_REFRESH_REQUEST,
});

export const successRefreshCatalogue = (path, accounts, next) => ({
  accounts,
  next,
  path,
  type: CATALOGUE_REFRESH_SUCCESS,
});

export const failureRefreshCatalogue = (path, error) => ({
  error,
  path,
  type: CATALOGUE_REFRESH_FAILURE,
});

export const expandCatalogue = path => (go, state, api) => {
  const catalogue = state.getIn(['catalogue', path]);

  if (catalogue && catalogue.get('isLoading')) return;

  const ids = catalogue ? catalogue.get('accounts') : void 0;
  const oldestId = ids && ids.size > 0 ? ids.last() : void 0;
  const params = {};

  if (oldestId !== void 0) params.max_id = oldestId;
  params.limit = 10;

  go(requestExpandCatalogue(path));
  api.get(path, { params })
    .then(response => go(successExpandCatalogue(path, response.data.value, response.data.next)))
    .catch(error => go(failureExpandCatalogue(path, error)));
};

export const requestExpandCatalogue = path => ({
  path,
  type: CATALOGUE_EXPAND_REQUEST,
});

export const successExpandCatalogue = (path, accounts, next) => ({
  accounts,
  next,
  path,
  type: CATALOGUE_EXPAND_SUCCESS,
});

export const failureExpandCatalogue = (path, error) => ({
  error,
  path,
  type: CATALOGUE_EXPAND_FAILURE,
});
