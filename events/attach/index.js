//  EVENTS:ATTACH
//  =============

//  Imports.
import { DOMDispatch } from 'flavours/go/lib/DOM';

//  The event.
export default function GOAttach (id) {
  DOMDispatch(GOAttach, { id });
}

//  Event type.
GOAttach.type = 'mastodongoattach';
