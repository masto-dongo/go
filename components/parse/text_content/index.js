import { DOMParser } from 'themes/mastodon-go/util/polyfills';

export function parseTextContent (html) {
  const parser = new DOMParser;

  //  This creates a document with the DOM contents of our `html` and a
  //  TreeWalker to walk them. We only care about paragraphs and
  //  line-breaks.
  const doc = parser.parseFromString(html, 'text/html');
  const walker = doc.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode (node) {
    const nodeName = node.nodeName.toUpperCase();
    switch (true) {
    case node.nodeType === Node.TEXT_NODE:
    case nodeName === 'P':
    case nodeName === 'BR':
      return NodeFilter.FILTER_ACCEPT;
    }
  } });

  //  This stores our text content.
  const text = [];

  //  This walks the contents of our status.
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const nodeName = node.nodeName.toUpperCase();
    switch (nodeName) {

    //  If our element is a BR, we add a line break.
    case 'BR':
      text.push('\n');
      break;

    //  If our element is a P, then we add two line breaks—assuming
    //  that we have processed some text content already.
    case 'P':
      if (text.length) text.push('\n\n');
      break;

    //  Otherwise we just push the text.
    default:
      text.push(node.textContent);
    }
  }

  //  Finally, we can return the resultant text.
  return text.join('');
}
