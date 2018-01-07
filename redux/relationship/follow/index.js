//  RELATIONSHIP:FOLLOW
//  ===================

//  Action types.
export const RELATIONSHIP_FOLLOW_REQUEST = 'RELATIONSHIP_FOLLOW_REQUEST';
export const RELATIONSHIP_FOLLOW_SUCCESS = 'RELATIONSHIP_FOLLOW_SUCCESS';
export const RELATIONSHIP_FOLLOW_FAILURE = 'RELATIONSHIP_FOLLOW_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: RELATIONSHIP_FOLLOW_REQUEST,
});
const success = relationship => ({
  relationship,
  type: RELATIONSHIP_FOLLOW_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: RELATIONSHIP_FOLLOW_FAILURE,
});

//  Request.
export default function followAccount (id, go, current, api) {
  go(request, id);
  api.get(
    `/api/v1/accounts/${id}/follow`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
