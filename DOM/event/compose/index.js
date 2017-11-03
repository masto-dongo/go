//  DOM:COMPOSE
//  ===========

//  Imports.
import { DOMDispatch } from 'themes/mastodon-go/DOM';

//  The event.
export default function DOMEventCompose (options = {}) {
  DOMDispatch(DOMEventCompose, {
    inReplyTo: options.inReplyTo,
    spoiler: options.spoiler,
    text: options.text,
    visibility: options.visibility,
  });
}

//  Event type.
DOMEventCompose.type = 'mastodongocompose';
