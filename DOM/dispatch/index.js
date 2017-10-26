import { CustomEvent } from 'themes/mastodon-go/util/polyfills';
import { DOMRoot } from 'themes/mastodon-go/DOM';

export default function DOMDispatch (event, detail) {
  DOMRoot().dispatchEvent(new CustomEvent(typeof event === 'function' ? event.type : event, { detail }));
}
