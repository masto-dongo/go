//  DOM:FORGET
//  ==========

//  Imports.
import { DOMRoot } from '../root';

//  This function removes an event listener at the DOM root.
export default function DOMForget (event, callback) {
  DOMRoot().removeEventListener(typeof event === 'function' ? event.type : event, callback, false);
}
