import { DOMRoot } from 'themes/mastodon-go/DOM';

export default function DOMForget (event, callback) {
  DOMRoot().removeEventListener(event, callback, false);
}
