//  COURIER:CONNECT
//  ===============

//  Imported requests.
import { fetchRelationship } from 'mastodon-go/redux';

//  Action types.
export const COURIER_CONNECT_OPEN = 'COURIER_CONNECT_OPEN';
export const COURIER_CONNECT_HALT = 'COURIER_CONNECT_HALT';

//  Action creators.
const open = { type: COURIER_CONNECT_OPEN };
const halt = { type: COURIER_CONNECT_HALT };

//  Request.
export const connectCourier = (open, go) => go(open ? open : halt);
