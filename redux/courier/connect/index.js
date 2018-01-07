//  COURIER:CONNECT
//  ===============

//  Action types.
export const COURIER_CONNECT_OPEN = 'COURIER_CONNECT_OPEN';
export const COURIER_CONNECT_HALT = 'COURIER_CONNECT_HALT';

//  Action creators.
const open = { type: COURIER_CONNECT_OPEN };
const halt = { type: COURIER_CONNECT_HALT };

//  Request.
export default function connectCourier (makeOpen, go) {
  go(makeOpen ? open : halt);
}
