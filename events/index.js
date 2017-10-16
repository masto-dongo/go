let root = null;

export function listen (event, callback) {
  root.addEventListener(event, callback, false);
}

export function forget (event, callback) {
  root.removeEventListener(event, callback, false);
}

export default function events (theRoot) {
  root = theRoot;
}
