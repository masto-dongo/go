//  DOM:DISPATCH
//  ============

//  Imports.
import { CustomEvent } from 'themes/mastodon-go/util/polyfills';
import { DOMRoot } from 'themes/mastodon-go/DOM';

//  We just dispatch the event to the DOM root.
export default function DOMDispatch (event, detail) {
  DOMRoot().dispatchEvent(new CustomEvent(typeof event === 'function' ? event.type : event, { detail }));
}
