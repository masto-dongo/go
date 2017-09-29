//  ACCOUNT:MUTE
//  ============

//  Action types.
export const ACCOUNT_MUTE_REQUEST = 'ACCOUNT_FOLLOW_REQUEST';
export const ACCOUNT_MUTE_SUCCESS = 'ACCOUNT_FOLLOW_SUCCESS';
export const ACCOUNT_MUTE_FAILURE = 'ACCOUNT_FOLLOW_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: ACCOUNT_MUTE_REQUEST,
});
const success = relationship => ({
  relationship,
  type: ACCOUNT_MUTE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: ACCOUNT_MUTE_FAIL,
});

//  Request.
export const muteAccount = (id, go, current, api) => {
  go(request, id);
  api.post(
    `/api/v1/accounts/${id}/mute`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
};
