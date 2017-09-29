//  TIMELINE:UPDATE
//  ===============

//  Action types.
export const TIMELINE_UPDATE_RECEIVE = 'TIMELINE_UPDATE_RECEIVE';

//  Action creators.
const receive = (path, status) => ({
  path,
  status,
  type: TIMELINE_UPDATE_RECEIVE
});

//  Request.
export const updateTimeline = (path, status, go) => go(receive, path, status);
