//  EVENTS:COMPOSE
//  ==============

//  Imports.
import { DOMDispatch } from 'flavours/go/lib/DOM';

//  The event.
export default function GOCompose (options = {}) {
  DOMDispatch(GOCompose, {
    inReplyTo: options.inReplyTo,
    spoiler: options.spoiler,
    text: options.text,
    visibility: options.visibility,
  });
}

//  Event type.
GOCompose.type = 'mastodongocompose';
