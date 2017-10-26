import { DOMRoot } from 'themes/mastodon-go/DOM';

export default function DOMListen (event, callback) {
  DOMRoot().addEventListener(typeof event === 'function' ? event.type : event, callback, false);
}
