//  Other imports.
import DOMParser from './polyfills/DOMParser';

//  The function.
export default function deHTMLify (text) {

  //  This creates a document with the DOM contents of our `text` and a
  //  TreeWalker to walk them.  We only care about links, paragraphs,
  //  and line-breaks.  The noncharacters U+FDD0..U+FDD2 are used
  //  internally as link delimiters, so we'll need to replace them
  //  should they appear somewhere in our text.
  const parser = new DOMParser;
  const doc = parser.parseFromString(text.replace(/[\uFDD0-\uFDD2]/g, '�'), 'text/html');
  const walker = doc.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode (node) {
      const nodeName = node.nodeName.toUpperCase();
      switch (true) {
      case node.parentElement && node.parentElement.nodeName.toUpperCase() === 'A':
        return NodeFilter.FILTER_REJECT;  //  No link children
      case node.nodeType === Node.TEXT_NODE:
      case nodeName === 'A':
      case nodeName === 'P':
      case nodeName === 'BR':
        return NodeFilter.FILTER_ACCEPT;
      default:
        return NodeFilter.FILTER_SKIP;
      }
    },
  });

  //  We'll store our de-HTML-ified result in `result`.
  const result = [];

  //  This walks the contents of our text.
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const nodeName = node.nodeName.toUpperCase();
    switch (nodeName) {

    //  We use the noncharacters U+FDD0..U+FDD2 as delimiters for links
    //  so that we can pass them through to our ƔAML processor as plain
    //  text.
    case 'A':
      result.push(`\uFDD0${node.textContent}\uFDD1${node.href}\uFDD2`);
      break;

    //  If our element is a BR, we insert a line break.
    case 'BR':
      result.push('\n');
      break;

    //  If our element is a P, then we add two line breaks—assuming
    //  that we have processed some text content already.
    case 'P':
      if (result.length) result.push('\n\n');
      break;

    //  Otherwise we just push the text.
    default:
      result.push(node.textContent);
    }
  }

  //  Now we can return our result.

  return result.join('');
}

