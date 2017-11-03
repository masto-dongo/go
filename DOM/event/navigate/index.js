//  DOM:NAVIGATE
//  ============

//  Imports.
import { DOMDispatch } from 'themes/mastodon-go/DOM';

//  The event.
export default function DOMEventNavigate (destination) {
  DOMDispatch(DOMEventNavigate, { destination });
}

//  Event type.
DOMEventNavigate.type = 'mastodongonavigate';
