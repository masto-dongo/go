//  DOM:ATTACH
//  ==========

//  Imports.
import { DOMDispatch } from 'themes/mastodon-go/DOM';

//  The event.
export default function DOMEventAttach (id) {
  DOMDispatch(DOMEventAttach, { id });
}

//  Event type.
DOMEventAttach.type = 'mastodongoattach';
