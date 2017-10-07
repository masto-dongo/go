//  TIMELINE:ENSURE
//  ===============

//  Action types.
export const TIMELINE_ENSURE_MAKE = 'TIMELINE_ENSURE_MAKE';

//  Action creators.
const make = path => ({
  path,
  type: TIMELINE_ENSURE_MAKE
});

//  Request.
export default function ensureTimeline (path, go) {
  go(make, path);
}
