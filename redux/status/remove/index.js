//  STATUS:REMOVE
//  =============

//  Action types.
export const STATUS_REMOVE_COMPLETE = 'STATUS_REMOVE_COMPLETE';

//  Action creators.
const complete = ids => ({
  ids,
  type: STATUS_REMOVE_COMPLETE,
});

//  Request.
export const removeStatus = (ids, go) => go(complete, ids);