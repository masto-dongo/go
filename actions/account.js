export const ACCOUNT_AUTHORIZE_REQUEST = 'ACCOUNT_AUTHORIZE_REQUEST';
export const ACCOUNT_AUTHORIZE_SUCCESS = 'ACCOUNT_AUTHORIZE_SUCCESS';
export const ACCOUNT_AUTHORIZE_FAILURE = 'ACCOUNT_AUTHORIZE_FAILURE';

export const ACCOUNT_BLOCK_REQUEST = 'ACCOUNT_BLOCK_REQUEST';
export const ACCOUNT_BLOCK_SUCCESS = 'ACCOUNT_BLOCK_SUCCESS';
export const ACCOUNT_BLOCK_FAILURE = 'ACCOUNT_BLOCK_FAILURE';

export const ACCOUNT_DOMAIN_BLOCK_REQUEST = 'ACCOUNT_DOMAIN_BLOCK_REQUEST';
export const ACCOUNT_DOMAIN_BLOCK_SUCCESS = 'ACCOUNT_DOMAIN_BLOCK_SUCCESS';
export const ACCOUNT_DOMAIN_BLOCK_FAILURE = 'ACCOUNT_DOMAIN_BLOCK_FAILURE';

export const ACCOUNT_FETCH_REQUEST = 'ACCOUNT_FETCH_REQUEST';
export const ACCOUNT_FETCH_SUCCESS = 'ACCOUNT_FETCH_SUCCESS';
export const ACCOUNT_FETCH_FAILURE = 'ACCOUNT_FETCH_FAILURE';

export const ACCOUNT_FOLLOW_REQUEST = 'ACCOUNT_FOLLOW_REQUEST';
export const ACCOUNT_FOLLOW_SUCCESS = 'ACCOUNT_FOLLOW_SUCCESS';
export const ACCOUNT_FOLLOW_FAILURE = 'ACCOUNT_FOLLOW_FAILURE';

export const ACCOUNT_MUTE_REQUEST = 'ACCOUNT_FOLLOW_REQUEST';
export const ACCOUNT_MUTE_SUCCESS = 'ACCOUNT_FOLLOW_SUCCESS';
export const ACCOUNT_MUTE_FAILURE = 'ACCOUNT_FOLLOW_FAILURE';

export const ACCOUNT_RELATE_REQUEST = 'ACCOUNT_RELATE_REQUEST';
export const ACCOUNT_RELATE_SUCCESS = 'ACCOUNT_RELATE_SUCCESS';
export const ACCOUNT_RELATE_FAILURE = 'ACCOUNT_RELATE_FAILURE';

export const ACCOUNT_REJECT_REQUEST = 'ACCOUNT_REJECT_REQUEST';
export const ACCOUNT_REJECT_SUCCESS = 'ACCOUNT_REJECT_SUCCESS';
export const ACCOUNT_REJECT_FAILURE = 'ACCOUNT_REJECT_FAILURE';

export const ACCOUNT_UNBLOCK_REQUEST = 'ACCOUNT_UNBLOCK_REQUEST';
export const ACCOUNT_UNBLOCK_SUCCESS = 'ACCOUNT_UNBLOCK_SUCCESS';
export const ACCOUNT_UNBLOCK_FAILURE = 'ACCOUNT_UNBLOCK_FAILURE';

export const ACCOUNT_UNFOLLOW_REQUEST = 'ACCOUNT_UNFOLLOW_REQUEST';
export const ACCOUNT_UNFOLLOW_SUCCESS = 'ACCOUNT_UNFOLLOW_SUCCESS';
export const ACCOUNT_UNFOLLOW_FAILURE = 'ACCOUNT_UNFOLLOW_FAILURE';

export const ACCOUNT_UNMUTE_REQUEST = 'ACCOUNT_UNMUTE_REQUEST';
export const ACCOUNT_UNMUTE_SUCCESS = 'ACCOUNT_UNMUTE_SUCCESS';
export const ACCOUNT_UNMUTE_FAILURE = 'ACCOUNT_UNMUTE_FAILURE';

export const authorizeAccount = id => (go, state, api) => {
  go(requestAuthorizeAccount(id));
  api.post(`/api/v1/follow_requests/${id}/authorize`)
    .then(response => go(successAuthorizeAccount(id)))
    .catch(error => go(failureAuthorizeAccount(id, error)));
};

export const requestAuthorizeAccount = id => ({
  id,
  type: ACCOUNT_AUTHORIZE_REQUEST,
});

export const successAuthorizeAccount = id => ({
  id,
  type: ACCOUNT_AUTHORIZE_SUCCESS,
});

export const failureAuthorizeAccount = (id, error) => ({
  error,
  id,
  type: ACCOUNT_AUTHORIZE_FAIL,
});

export const blockAccount = id => (go, state, api) => {
  go(requestBlockAccount(id));
  api.post(`/api/v1/accounts/${id}/block`)
    .then(response => go(successBlockAccount(response.data.value, state.get('statuses'))))
    .catch(error => go(failureBlockAccount(id, error)));
};

export const requestBlockAccount = id => ({
  id,
  type: ACCOUNT_BLOCK_REQUEST,
});

export const successBlockAccount = (relationship, statuses) => ({
  relationship,
  statuses,
  type: ACCOUNT_BLOCK_SUCCESS,
});

export const failureBlockAccount = (id, error) => ({
  error,
  id,
  type: ACCOUNT_BLOCK_FAIL,
});

export const blockDomainAccount = id => (go, state, api) => {
  if (!state.getIn(['account', id])) return;
  go(requestBlockDomainAccount(id));
  api.post('/api/v1/domain_blocks', {
    domain: state.getIn(['account', id, 'domain']),
  }).then(() => go(blockDomainSuccess(id)))
    .catch(error => go(blockDomainFail(id, error)));
};

export const requestBlockDomainAccount = id => ({
  id,
  type: ACCOUNT_DOMAIN_BLOCK_REQUEST,
});

export const successBlockDomainAccount = id => ({
  domain,
  id,
  type: ACCOUNT_DOMAIN_BLOCK_SUCCESS,
});

export const blockDomainFail => (id, error) => ({
  error,
  id,
  type: ACCOUNT_DOMAIN_BLOCK_FAILURE,
});

export const fetchAccount = id => (go, state, api) => {
  go(relateAccount(id));
  if (state.getIn(['accounts', id])) return;
  go(requestFetchAccount(id));
  api.get(`/api/v1/accounts/${id}`)
    .then(response => go(successFetchAccount(response.data.value)))
    .catch(error => go(failureFetchAccount(id, error)));
};

export const requestFetchAccount = id => ({
  id,
  type: ACCOUNT_FETCH_REQUEST,
});

export const successFetchAccount = account => ({
  account,
  type: ACCOUNT_FETCH_SUCCESS,
});

export const failureFetchAccount = (id, error) => ({
  error,
  id,
  type: ACCOUNT_FETCH_FAILURE,
});

export const followAccount = id => (go, state, api) => {
  if (state.getIn(['accounts', id])) return;
  go(requestFollowAccount(id));
  api.get(`/api/v1/accounts/${id}/follow`)
    .then(response => go(successFollowAccount(response.data.value)))
    .catch(error => go(failureFollowAccount(id, error)));
};

export const requestFollowAccount = id => ({
  id,
  type: ACCOUNT_FOLLOW_REQUEST,
});

export const successFollowAccount = relationship => ({
  relationship,
  type: ACCOUNT_FOLLOW_SUCCESS,
});

export const failureFollowAccount = (id, error) => ({
  error,
  id,
  type: ACCOUNT_FOLLOW_FAILURE,
});

export const muteAccount = id => (go, state, api) => {
  go(requestMuteAccount(id));
  api.post(`/api/v1/accounts/${id}/mute`)
    .then(response => go(successMuteAccount(response.data.value)))
    .catch(error => go(failureMuteAccount(id, error)));
};

export const requestMuteAccount = id => ({
  id,
  type: ACCOUNT_MUTE_REQUEST,
});

export const successMuteAccount = relationship => ({
  relationship,
  type: ACCOUNT_MUTE_SUCCESS,
});

export const failureMuteAccount = (id, error) => ({
  error,
  id,
  type: ACCOUNT_MUTE_FAIL,
});

export const relateAccount = ids => (go, state, api) => {
  const loaded = state.get('relationships');
  const newIds = (ids instanceof Array ? ids : [ids]).filter(id => loaded.get(id) === void 0);
  if (!ids.length) return;
  go(requestRelateAccount(newIds));
  api.get(`/api/v1/accounts/relationships?${newIds.map(id => `id[]=${id}`).join('&')}`);
    .then(response => go(successRelateAccount(response.data.value)))
    .catch(error => go(failureRelateAccount(newIds, error)));
};

export const requestRelateAccount = ids => ({
  ids,
  type: ACCOUNT_RELATE_REQUEST,
});

export const successRelateAccount = relationships => ({
  relationships,
  type: ACCOUNT_RELATE_SUCCESS,
});

export const failureRelateAccount = (ids, error) => ({
  error,
  ids,
  type: ACCOUNT_RELATE_FAILURE,
});

export const rejectAccount = id => (go, state, api) => {
  go(requestRejectAccount(id));
  api.post(`/api/v1/follow_requests/${id}/reject`)
    .then(response => go(successRejectAccount(id)))
    .catch(error => go(failureRejectAccount(id, error)));
};

export const requestRejectAccount = id => ({
  id,
  type: ACCOUNT_REJECT_REQUEST,
});

export const successRejectAccount = id => ({
  id,
  type: ACCOUNT_REJECT_SUCCESS,
});

export const failureRejectAccount = (id, error) => ({
  error,
  id,
  type: ACCOUNT_REJECT_FAIL,
});

export const unblockAccount = id => (go, state, api) => {
  go(requestUnblockAccount(id));
  api.post(`/api/v1/accounts/${id}/unblock`)
    .then(response => go(successUnblockAccount(response.data.value)))
    .catch(error => go(failureUnblockAccount(id, error)));
};

export const requestUnblockAccount = id => ({
  id,
  type: ACCOUNT_UNBLOCK_REQUEST,
});

export const successUnblockAccount = relationship => ({
  relationship,
  type: ACCOUNT_UNBLOCK_SUCCESS,
});

export const failureUnblockAccount = (id, error) => ({
  error,
  id,
  type: ACCOUNT_UNBLOCK_FAIL,
});

export const unfollowAccount = id => (go, state, api) => {
  go(requestUnmuteAccount(id));
  api.post(`/api/v1/accounts/${id}/unfollow`)
    .then(response => go(successUnmuteAccount(response.data.value)))
    .catch(error => go(failureUnmuteAccount(id, error)));
};

export const requestUnfollowAccount = id => ({
  id,
  type: ACCOUNT_UNMUTE_REQUEST,
});

export const successUnfollowAccount = relationship => ({
  relationship,
  type: ACCOUNT_UNMUTE_SUCCESS,
});

export const failureUnfollowAccount = (id, error) => ({
  error,
  id,
  type: ACCOUNT_UNMUTE_FAIL,
});

export const unmuteAccount = id => (go, state, api) => {
  go(requestUnmuteAccount(id));
  api.post(`/api/v1/accounts/${id}/unmute`)
    .then(response => go(successUnmuteAccount(response.data.value)))
    .catch(error => go(failureUnmuteAccount(id, error)));
};

export const requestUnmuteAccount = id => ({
  id,
  type: ACCOUNT_UNMUTE_REQUEST,
});

export const successUnmuteAccount = relationship => ({
  relationship,
  type: ACCOUNT_UNMUTE_SUCCESS,
});

export const failureUnmuteAccount = (id, error) => ({
  error,
  id,
  type: ACCOUNT_UNMUTE_FAIL,
});
