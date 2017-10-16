//  RELATIONSHIP:MUTE
//  =================

//  Action types.
export const RELATIONSHIP_MUTE_REQUEST = 'RELATIONSHIP_FOLLOW_REQUEST';
export const RELATIONSHIP_MUTE_SUCCESS = 'RELATIONSHIP_FOLLOW_SUCCESS';
export const RELATIONSHIP_MUTE_FAILURE = 'RELATIONSHIP_FOLLOW_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: RELATIONSHIP_MUTE_REQUEST,
});
const success = relationship => ({
  relationship,
  type: RELATIONSHIP_MUTE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: RELATIONSHIP_MUTE_FAILURE,
});

//  Request.
export default function muteRelationship (id, go, current, api) {
  go(request, id);
  api.post(
    `/api/v1/accounts/${id}/mute`
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
