import { DOMRoot } from 'themes/mastodon-go/DOM';

export default function DOMForget (event, callback) {
  DOMRoot().removeEventListener(typeof event === 'function' ? event.type : event, callback, false);
}
