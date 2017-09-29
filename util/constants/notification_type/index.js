//  CONSTANTS:NOTIFICATION_TYPE
//  ===========================

//  `PLAIN` notifications do not contain a status, whereas `REACTION`
//  notifications do.
export const UNKNOWN   = 0x00;
export const PLAIN     = 0x10;  //  Used with comparisons
export const FOLLOW    = 0x11;
export const REACTION  = 0x20;  //  Used with comparisons
export const FAVOURITE = 0x21;
export const REBLOG    = 0x22;
export const MENTION   = 0x24;
