import { DOMDispatch } from 'themes/mastodon-go/DOM';

export default function DOMEventCompose (options = {}) {
  DOMDispatch(DOMEventNavigate, {
    inReplyTo: options.inReplyTo,
    spoiler: options.spoiler,
    text: options.text,
    visibility: options.visibility,
  });
}

DOMEventCompose.type = 'mastodongocompose';
