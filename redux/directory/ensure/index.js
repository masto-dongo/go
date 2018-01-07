//  DIRECTORY:ENSURE
//  ================

//  Action types.
export const DIRECTORY_ENSURE_MAKE = 'DIRECTORY_ENSURE_MAKE';

//  Action creators.
const make = path => ({
  path,
  type: DIRECTORY_ENSURE_MAKE,
});

//  Request.
export default function ensureDirectory (path, go) {
  go(make, path);
}
