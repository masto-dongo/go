//  MODULE:READY
//  ============

//  Imports.
import { waiting } from '../on_ready';

//  Fires all of our callbacks.
export default function moduleReady () {
  let fn;
  while ((fn = waiting.pop())) {
    if (typeof fn === 'function') {
      fn();
    }
  }
}
