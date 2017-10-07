//  CATALOGUE:ENSURE
//  ================

//  Action types.
export const CATALOGUE_ENSURE_MAKE = 'CATALOGUE_ENSURE_MAKE';

//  Action creators.
const make = path => ({
  path,
  type: CATALOGUE_ENSURE_MAKE
});

//  Request.
export default function ensureCatalogue (path, go) {
  go(make, path);
}
