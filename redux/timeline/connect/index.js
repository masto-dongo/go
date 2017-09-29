//  TIMELINE:CONNECT
//  ================

//  Action types.
export const TIMELINE_CONNECT_OPEN = 'TIMELINE_CONNECT_OPEN';
export const TIMELINE_CONNECT_HALT = 'TIMELINE_CONNECT_HALT';

//  Action creators.
const open = path => ({
  path,
  type: TIMELINE_CONNECT_OPEN,
});
const halt = path => ({
  path,
  type: TIMELINE_CONNECT_HALT,
});

//  Request.
export const connectTimeline = (path, open, go) => go(open ? open : halt, path);
