//  META:LOAD
//  =========

//  Action types.
export const META_LOAD_COMPLETE = 'META_LOAD_COMPLETE';

//  Action creators.
const complete = meta => ({
  meta,
  type: META_LOAD_COMPLETE,
});

//  Request.
export default function loadMeta (go) {
  try {
    go(complete, JSON.parse(document.getElementById('initial-state').textContent));
  } catch (error) {}
}
