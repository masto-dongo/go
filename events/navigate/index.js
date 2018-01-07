//  EVENTS:NAVIGATE
//  ===============

//  Imports.
import { DOMDispatch } from 'flavours/go/lib/DOM';

//  The event.
export default function GONavigate (destination) {
  DOMDispatch(GONavigate, { destination });
}

//  Event type.
GONavigate.type = 'mastodongonavigate';
