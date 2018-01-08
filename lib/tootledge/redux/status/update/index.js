//  STATUS:UPDATE
//  =============

//  Action types.
export const STATUS_UPDATE_RECEIVE = 'STATUS_UPDATE_RECEIVE';

//  Action creators.
const receive = status => ({
  status,
  type: STATUS_UPDATE_RECEIVE,
});

//  Request.
export default function updateStatus (status, go) {
  go(receive, status);
}
