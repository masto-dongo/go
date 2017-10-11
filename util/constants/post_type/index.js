//  CONSTANTS:POST_TYPE
//  ===================

//  `PLAIN` notifications do not contain a status, whereas `REACTION`
//  notifications do.

export const UNKNOWN      = 0b00000000;
export const IS_FAVOURITE = 0b00000001;  //  Used with comparisons
export const IS_REBLOG    = 0b00000010;  //  Used with comparisons
export const IS_MENTION   = 0b00000100;  //  Used with comparisons
export const HAS_MEDIA    = 0b00001000;  //  Used with comparisons
export const IS_FOLLOW    = 0b00010000;  //  Used with comparisons
export const IS_REQUEST   = 0b00100000;  //  Speculative; used with comparisons

export const STATUS       = 0b01000000;  //  Used with comparisons
export const FAVOURITED   = 0b01000001;
export const REBLOGGED    = 0b01000010;
export const REPLY        = 0b01000100;
export const MEDIA        = 0b01001000;

export const PLAIN        = 0b10000000;  //  Used with comparisons
export const FOLLOW       = 0b10010000;
export const REQUEST      = 0b10100000;  //  Speculative

export const REACTION     = 0b11000000;  //  Used with comparisons
export const FAVOURITE    = 0b11000001;
export const REBLOG       = 0b11000010;
export const MENTION      = 0b11000100;
