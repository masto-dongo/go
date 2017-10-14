//  CONSTANTS:POST_TYPE
//  ===================

//  `PLAIN` notifications do not contain a status, whereas `REACTION`
//  notifications do.

export const UNKNOWN      = 0b0000000000;
export const IS_FAVOURITE = 0b0000000001;  //  Used with comparisons
export const IS_REBLOG    = 0b0000000010;  //  Used with comparisons
export const IS_MENTION   = 0b0000000100;  //  Used with comparisons
export const HAS_MEDIA    = 0b0000001000;  //  Used with comparisons
export const IS_FOLLOW    = 0b0000010000;  //  Used with comparisons
export const IS_REQUEST   = 0b0000100000;  //  Speculative; used with comparisons
export const IS_BLOCK     = 0b0001000000;  //  Used with comparisons
export const IS_MUTE      = 0b0010000000;  //  Used with comparisons

export const STATUS       = 0b0100000000;  //  Used with comparisons
export const FAVOURITED   = 0b0100000001;
export const REBLOGGED    = 0b0100000010;
export const REPLY        = 0b0100000100;
export const MEDIA        = 0b0100001000;

export const PLAIN        = 0b1000000000;  //  Used with comparisons
export const FOLLOW       = 0b1000010000;
export const REQUEST      = 0b1000100000;  //  Speculative
export const BLOCK        = 0b1001000000;
export const MUTE         = 0b1010000000;

export const REACTION     = 0b1100000000;  //  Used with comparisons
export const FAVOURITE    = 0b1100000001;
export const REBLOG       = 0b1100000010;
export const MENTION      = 0b1100000100;
