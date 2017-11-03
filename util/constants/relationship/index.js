//  CONSTANTS:RELATIONSHIP
//  ======================

//  Valid `RELAITONSHIP`s are represented via binary flags:

//  - __`00000001` :__ The user is being followed by the account
//  - __`00000010` :__ The account is followed by the user
//  - __`00000100` :__ The user has sent the account a follow request
//  - __`00001000` :__ The user is blocking the account
//  - __`00010000` :__ The user is muting the account
//  - __`00100000` :__ The user is muting notifications for the account
//  - __`01000000` :__ The relationship status is unknown
//  - __`10000000` :__ The user is the same as the account

//  Not all combinations are possible; only those that make sense are
//  provided with names.
export const NONE                        = 0b00000000;
export const FOLLOWER                    = 0b00000001;
export const FOLLOWED                    = 0b00000010;
export const MUTUAL                      = 0b00000011;
export const REQUESTED                   = 0b00000100;
export const REQUESTED_MUTUAL            = 0b00000101;
export const BLOCKED                     = 0b00001000;
export const MUTED                       = 0b00010000;
export const MUTED_FOLLOWER              = 0x00010001;
export const MUTED_FOLLOWED              = 0x00010010;
export const MUTED_MUTUAL                = 0x00010011;
export const MUTED_REQUESTED             = 0x00010100;
export const MUTED_REQUESTED_MUTUAL      = 0x00010101;
export const NOTIFICATIONS_MUTED         = 0x00100000;  //  Used with comparisons
export const HARD_MUTED                  = 0x00110000;
export const HARD_MUTED_FOLLOWER         = 0x00110001;
export const HARD_MUTED_FOLLOWED         = 0x00110010;
export const HARD_MUTED_MUTUAL           = 0x00110011;
export const HARD_MUTED_REQUESTED        = 0x00110100;
export const HARD_MUTED_REQUESTED_MUTUAL = 0x00110101;
export const UNKNOWN                     = 0x01000000;  //  Unused
export const SELF                        = 0x10000000;
