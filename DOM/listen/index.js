import { DOMRoot } from 'themes/mastodon-go/DOM';

export default function DOMListen (event, callback) {
  DOMRoot().addEventListener(event, callback, false);
}
