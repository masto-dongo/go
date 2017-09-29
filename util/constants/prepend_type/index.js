//  CONSTANTS:PREPEND_TYPE
//  ======================

//  Here are our `PREPEND_TYPE`s.
export const UNKNOWN                = 0x00;
export const REBLOG                 = 0x01;  //  Used with comparisons
export const FAVOURITE              = 0x02;  //  Used with comparisons
export const REPLY                  = 0x04;  //  Used with comparisons
export const STATUS                 = 0x10;  //  Used with comparisons
export const STATUS_REBLOG          = 0x11;
export const STATUS_REPLY           = 0x14;
export const STATUS_REBLOGGED_REPLY = 0x15;
export const NOTIFICATION           = 0x20;  //  Used with comparisons
export const NOTIFICATION_REBLOG    = 0x21;
export const NOTIFICATION_FAVOURITE = 0x22;
export const NOTIFICATION_REPLY     = 0x24;
