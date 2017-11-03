//  DOM:INSERT
//  ==========

//  Imports.
import { DOMDispatch } from 'themes/mastodon-go/DOM';

//  The event.
export default function DOMEventInsert (text) {
  DOMDispatch(DOMEventInsert, { text });
}

//  Event type.
DOMEventInsert.type = 'mastodongoinsert';
