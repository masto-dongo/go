import { DOMDispatch } from 'themes/mastodon-go/DOM';

export default function DOMEventAttach (id) {
  DOMDispatch(DOMEventAttach, { id });
}

DOMEventAttach.type = 'mastodongoattach';
