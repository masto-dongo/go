//  ACCOUNT:UNFOLLOW
//  ================

//  Action types.
export const ACCOUNT_UNFOLLOW_REQUEST = 'ACCOUNT_UNFOLLOW_REQUEST';
export const ACCOUNT_UNFOLLOW_SUCCESS = 'ACCOUNT_UNFOLLOW_SUCCESS';
export const ACCOUNT_UNFOLLOW_FAILURE = 'ACCOUNT_UNFOLLOW_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: ACCOUNT_UNFOLLOW_REQUEST,
});
const success = relationship => ({
  relationship,
  type: ACCOUNT_UNFOLLOW_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: ACCOUNT_UNFOLLOW_FAIL,
});

//  Request.
export const unfollowAccount = (id, go, current, api) => {
  go(request, id);
  api.post(
    `/api/v1/accounts/${id}/unfollow`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
};
