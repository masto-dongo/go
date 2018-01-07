//  NOTIFICATION:REMOVE
//  ===================

//  Action types.
export const NOTIFICATION_REMOVE_COMPLETE = 'NOTIFICATION_REMOVE_COMPLETE';

//  Action creators.
const complete = ids => ({
  ids,
  type: NOTIFICATION_REMOVE_COMPLETE,
});

//  Request.
export default function removeNotification (ids, go) {
  go(complete, ids);
}
