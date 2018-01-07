//  EVENTS:INSERT
//  =============

//  Imports.
import { DOMDispatch } from 'flavours/go/lib/DOM';

//  The event.
export default function GOInsert (text) {
  DOMDispatch(GOInsert, { text });
}

//  Event type.
GOInsert.type = 'mastodongoinsert';
