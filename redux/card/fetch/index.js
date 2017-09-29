//  CARD:FETCH
//  ==========

//  Action types.
export const CARD_FETCH_REQUEST = 'CARD_FETCH_REQUEST';
export const CARD_FETCH_SUCCESS = 'CARD_FETCH_SUCCESS';
export const CARD_FETCH_FAILURE = 'CARD_FETCH_FAILURE';

//  Action creators.
const request = status => ({
  status,
  type: CARD_FETCH_REQUEST,
});
const success = (status, card) => ({
  card,
  status,
  type: CARD_FETCH_SUCCESS,
});
const failure = (status, error) => ({
  error,
  status,
  type: CARD_FETCH_FAILURE,
});

//  Request.
export const cardStatus = (status, go, current, api) => {

  //  We only want to request cards that we don't already have. If we
  //  already have a card associated with this `status`, we do nothing.
  if (current().getIn(['card', status])) {
    return;
  }

  //  The request.
  go(request, status);
  api.get(
    `/api/v1/statuses/${status}/card`
  ).then(
    response => go(success, status, response.data)
  ).catch(
    error => go(failure, status, error)
  );
};
