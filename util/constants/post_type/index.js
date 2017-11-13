//  CONSTANTS:POST_TYPE
//  ===================

//  No post.
export const EMPTY         = 0;

//  Static properties.
export const IS_FAVOURITE  = 0b0000000000000001;  //  Used with comparisons
export const IS_REBLOG     = 0b0000000000000010;  //  Used with comparisons
export const IS_MENTION    = 0b0000000000000100;  //  Used with comparisons
export const IS_FOLLOW     = 0b0000000000001000;  //  Used with comparisons
export const IS_REQUEST    = 0b0000000000010000;  //  Speculative; used with comparisons
export const IS_BLOCK      = 0b0000000000100000;  //  Used with comparisons
export const IS_MUTE       = 0b0000000001000000;  //  Used with comparisons
export const IS_MINE       = 0b0000000010000000;  //  Used with comparisons
export const IS_RICH       = 0b0000000100000000;  //  Used with comparisons

//  Dynamic properties.
export const HAS_PIN       = 0b0001000000000000;  //  Used with comparisons
export const HAS_SILENCE   = 0b0010000000000000;  //  Used with comparisons
export const HAS_REBLOG    = 0b0100000000000000;  //  Used with comparisons
export const HAS_FAVOURITE = 0b1000000000000000;  //  Used with comparisons

//  Statuses.
export const STATUS        = 0x10000;  //  Used with comparisons
export const REBLOGGED     = STATUS | IS_REBLOG;
export const REPLY         = STATUS | IS_MENTION;
export const MINE          = STATUS | IS_MINE;
export const MULTIMEDIA    = STATUS | IS_RICH;

//  Plain notifications (without status).
export const PLAIN         = 0x20000;  //  Used with comparisons
export const FOLLOW        = PLAIN | IS_FOLLOW;
export const REQUEST       = PLAIN | IS_REQUEST;
export const BLOCK         = PLAIN | IS_BLOCK;
export const MUTE          = PLAIN | IS_MUTE;

//  Reaction notifications (with status).
export const REACTION      = STATUS | PLAIN;  //  Used with comparisons
export const FAVOURITE     = REACTION | IS_FAVOURITE;
export const REBLOG        = REACTION | IS_REBLOG;
export const MENTION       = REACTION | IS_MENTION;
