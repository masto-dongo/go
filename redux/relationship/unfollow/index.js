//  RELATIONSHIP:UNFOLLOW
//  =====================

//  Action types.
export const RELATIONSHIP_UNFOLLOW_REQUEST = 'RELATIONSHIP_UNFOLLOW_REQUEST';
export const RELATIONSHIP_UNFOLLOW_SUCCESS = 'RELATIONSHIP_UNFOLLOW_SUCCESS';
export const RELATIONSHIP_UNFOLLOW_FAILURE = 'RELATIONSHIP_UNFOLLOW_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: RELATIONSHIP_UNFOLLOW_REQUEST,
});
const success = relationship => ({
  relationship,
  type: RELATIONSHIP_UNFOLLOW_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: RELATIONSHIP_UNFOLLOW_FAIL,
});

//  Request.
export default function unfollowRelationship (id, go, current, api) {
  go(request, id);
  api.post(
    `/api/v1/accounts/${id}/unfollow`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
