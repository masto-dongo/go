let root = null;

export default function DOMRoot (id = 'mastodon') {
  if (!root) {
    root = document.getElementById(id);
  }
  return root;
}
