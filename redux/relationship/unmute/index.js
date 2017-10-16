//  RELATIONSHIP:UNMUTE
//  ===================

//  Action types.
export const RELATIONSHIP_UNMUTE_REQUEST = 'RELATIONSHIP_UNMUTE_REQUEST';
export const RELATIONSHIP_UNMUTE_SUCCESS = 'RELATIONSHIP_UNMUTE_SUCCESS';
export const RELATIONSHIP_UNMUTE_FAILURE = 'RELATIONSHIP_UNMUTE_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: RELATIONSHIP_UNMUTE_REQUEST,
});
const success = relationship => ({
  relationship,
  type: RELATIONSHIP_UNMUTE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: RELATIONSHIP_UNMUTE_FAILURE,
});

//  Request.
export default function unmuteRelationship (id, go, current, api) {
  go(request, id);
  api.post(
    `/api/v1/accounts/${id}/unmute`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
