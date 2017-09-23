//  COMPOSER:DISCARD
//  ================

//  Action types.
export const COMPOSER_DISCARD_SOME = 'COMPOSER_DISCARD_SOME';
export const COMPOSER_DISCARD_EACH = 'COMPOSER_DISCARD_EACH';

//  Action creators.
const some = ids => ({
  ids,
  type: COMPOSER_DISCARD_SOME,
});
const each = { type: COMPOSER_DISCARD_EACH };

//  Request.
export const discardComposer = (ids, go) => {
  if (ids) {
    go(some, ids);
  } else {
    go(each);
  }
}
