//  DOM:LISTEN
//  ==========

//  Imports.
import { DOMRoot } from 'themes/mastodon-go/DOM';

//  This function adds an event listener at the DOM root.
export default function DOMListen (event, callback) {
  DOMRoot().addEventListener(typeof event === 'function' ? event.type : event, callback, false);
}
