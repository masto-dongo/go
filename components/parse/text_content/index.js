/*********************************************************************\
|                                                                     |
|   <ParseTextContent>                                                |
|   ==================                                                |
|                                                                     |
|   The Mastodon API gives us HTML content sometimes, and sometimes   |
|   we just want plain text!!  `<ParseTextContent>` is the best way   |
|   to achieve that.  It mostly just uses `node.textContent` but it   |
|   is `<p>`- and `<br>`-aware and will insert line-breaks whenever   |
|   it encounters them.                                               |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

//  Stylesheet imports.
import './style';

//  Other imports.
import { DOMParser } from 'themes/mastodon-go/util/polyfills';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ParseTextContent ({
  className,
  text,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--PARSE--TEXT_CONTENT', className);

  //  This creates a document with the DOM contents of our `text` and a
  //  TreeWalker to walk them. We only care about paragraphs and
  //  line-breaks.
  const parser = new DOMParser;
  const doc = parser.parseFromString(text, 'text/html');
  const walker = doc.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode (node) {
      const nodeName = node.nodeName.toUpperCase();
      switch (true) {
      case node.nodeType === Node.TEXT_NODE:
      case name.toUpperCase() === 'P':
      case name.toUpperCase() === 'BR':
        return NodeFilter.FILTER_ACCEPT;
      default:
        return NodeFilter.FILTER_SKIP;
      }
    }
  });

  //  This stores our text content.
  const contents = [];

  //  This walks the contents of our status.
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const nodeName = node.nodeName.toUpperCase();
    switch (nodeName) {

    //  If our element is a BR, we add a line break.
    case 'BR':
      contents.push('\n');
      break;

    //  If our element is a P, then we add two line breaks—assuming
    //  that we have processed some text content already.
    case 'P':
      if (contents.length) contents.push('\n\n');
      break;

    //  Otherwise we just push the text.
    default:
      contents.push(node.textContent);
    }
  }

  //  Finally, we can return the resultant text.
  return (
    <span
      className={computedClass}
      {...rest}
    >{contents.join('')}</span>
  );
};

//  Props.
ParseStatusContent.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
};
