import { DOMDispatch } from 'themes/mastodon-go/DOM';

export default function DOMEventNavigate (destination) {
  DOMDispatch(DOMEventNavigate, { destination });
}

DOMEventNavigate.type = 'mastodongonavigate';
