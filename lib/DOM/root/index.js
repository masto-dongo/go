//  DOM:ROOT
//  ========

//  Variable declaration.
let root = null;

//  This function sets the DOM root it it has not yet been defined.
//  It returns the current root every time.
export default function DOMRoot (id = 'mastodon') {
  if (!root) {
    root = document.getElementById(id);
  }
  return root;
}
