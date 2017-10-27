import { DOMDispatch } from 'themes/mastodon-go/DOM';

export default function DOMEventInsert (text) {
  DOMDispatch(DOMEventInsert, { text });
}

DOMEventInsert.type = 'mastodongoinsert';
