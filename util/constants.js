//  These are the valid `CARD_TYPE`s.
export const CARD_TYPE = {
  UNKNOWN : 0b0000,
  LINK    : 0b0001,
  PHOTO   : 0b0010,
  VIDEO   : 0b0100,
  RICH    : 0b1000,
}

//  These are the valid `MEDIA_TYPE`s.
export const MEDIA_TYPE = {
  UNKNOWN : 0b000,
  IMAGE   : 0b001,
  AUDIO   : 0b010,  //  Speculative
  GIFV    : 0b100,
  VIDEO   : 0b110,
}

//  `PLAIN` notifications do not contain a status, whereas `REACTION`
//  notifications do.
export const NOTIFICATION_TYPE = {
  UNKNOWN   : 0x00,
  PLAIN     : 0x10,  //  Used with comparisons
  FOLLOW    : 0x11,
  REACTION  : 0x20,  //  Used with comparisons
  FAVOURITE : 0x21,
  REBLOG    : 0x22,
  MENTION   : 0x24,
}

//  These are the different valid `RELAITONSHIP`s. They are represented
//  via binary flags:

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
export const RELATIONSHIP = {
  NONE                        : 0b00000000,
  FOLLOWER                    : 0b00000001,
  FOLLOW                      : 0b00000010,
  MUTUAL                      : 0b00000011,
  REQUESTED                   : 0b00000100,
  REQUESTED_MUTUAL            : 0b00000101,
  BLOCKED                     : 0b00001000,
  MUTED                       : 0b00010000,
  MUTED_FOLLOWER              : 0x00010001,
  MUTED_FOLLOWS               : 0x00010010,
  MUTED_MUTUAL                : 0x00010011,
  MUTED_REQUESTED             : 0x00010100,
  MUTED_REQUESTED_MUTUAL      : 0x00010101,
  NOTIFICATIONS_MUTED         : 0x00100000,  //  Used with comparisons
  HARD_MUTED                  : 0x00110000,
  HARD_MUTED_FOLLOWER         : 0x00110001,
  HARD_MUTED_FOLLOWS          : 0x00110010,
  HARD_MUTED_MUTUAL           : 0x00110011,
  HARD_MUTED_REQUESTED        : 0x00110100,
  HARD_MUTED_REQUESTED_MUTUAL : 0x00110101,
  UNKNOWN                     : 0x01000000,  //  Unused; may change
  SELF                        : 0x10000000,
}

//  These are the different valid values for `VISIBILITY`. They are
//  represented via binary flags:

//  - __`00000001` :__ Visible to followers
//  - __`00000010` :__ Visible to non-followers
//  - __`00000100` :__ Visible on a profile
//  - __`00001000` :__ Visible on the public timelines
//  - __`00010000` :__ Boostable
//  - __`00100000` :__ Able to be federated

//  Most of these combinations are not presently available via the
//  Mastodon API. Those that are are defined below.
export const VISIBILITY = {
  LOCAL_DIRECT   : 0b00000000,
  FOLLOWERS      : 0b00000001,  //  Used with comparisons
  NON_FOLLOWERS  : 0b00000010,  //  Used with comparisons
  PROFILE        : 0b00000100,  //  Used with comparisons
  LOCAL_PRIVATE  : 0b00000101,
  TIMELINE       : 0b00001000,  //  Used with comparisons
  BOOSTABLE      : 0b00010000,  //  Used with comparisons
  LOCAL_UNLISTED : 0b00010111,
  LOCAL_PUBLIC   : 0b00011111,
  FEDERATED      : 0b00100000,  //  Alias; used with comparisons
  DIRECT         : 0b00100000,
  PRIVATE        : 0b00100101,
  UNLISTED       : 0b00110111,
  PUBLIC         : 0b00111111,
}
