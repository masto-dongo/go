//  MODULE:ON_READY
//  ===============

//  We will store our callbacks here.
export const waiting = [];

//  Adds a callback.
export default function moduleOnReady (fn) {
  waiting.push(fn);
}
