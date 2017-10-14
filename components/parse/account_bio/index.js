/*********************************************************************\
|                                                                     |
|   <ParseAccountBio>                                                 |
|   =================                                                 |
|                                                                     |
|   Because Mastodon's API gives us HTML and not plain-text, we are   |
|   forced to do a fair bit of HTML parsing in order to process the   |
|   bio frontmatter.  Additionally, we need to format links if they   |
|   appear—in both the bio and the metadata.  And, of course, we'll   |
|   use a <ParseContainer> to handle any emoji.                       |
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

//  Container imports.
import { ParseContainer } from 'themes/mastodon-go/components';

//  Common imports.
import { CommonLink } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Other imports.
import { DOMParser } from 'themes/mastodon-go/util/polyfills';
import { readƔaml } from 'themes/mastodon-go/util/ɣaml';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  The `parseLines()` function is an array reducer for parsing
//  plain-text lines.
function parseLines (pContents, line, lineNº, lines) => {

  //  First, we need to parse our line for any links.
  let linkMatch;
  while ((linkMatch = line.match(/([^]*?)\uFDD0([^]*)\uFDD1([^]*)\uFDD2([^]*)/))) {

    //  If there is text before the link, we push it.
    if (linkMatch[1]) {
      pContents.push(
        <ParseContainer
          key={pContents.length}
          text={linkMatch[1]}
          type='emoji'
        />
      );
    }

    //  Next, we push our link.
    pContents.push(
      <CommonLink
        href={linkMatch[3]}
        key={pContents.length}
      >
        <ParseContainer
          text={linkMatch[2]}
          type='emoji'
        />
      </CommonLink>
    );

    //  Finally, we reset our `line` to our remaining contents.
    line = linkMatch[4];
  }

  //  If any text remains in our line, we push it.
  if (line) {
    pContents.push(
      <ParseContainer
        key={pContents.length}
        text={line}
        type='emoji'
      />
    );
  }

  //  We push a line-break if this isn't the final line and return the
  //  paragraph contents.
  if (lineNº !== lines.length - 1) {
    pContents.push(<br key={pContents.length} />);
  }
  return pContents;
}

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ParseAccountBio ({
  className,
  text,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--PARSE--ACCOUNT_BIO', className);

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
      case name.toUpperCase() === 'A':
      case name.toUpperCase() === 'P':
      case name.toUpperCase() === 'BR':
        return NodeFilter.FILTER_ACCEPT;
      default:
        return NodeFilter.FILTER_SKIP;
      }
    }
  });

  //  We'll store our de-HTML-ified bio in `bio`.
  const bio = [];

  //  This walks the contents of our text.
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const nodeName = node.nodeName.toUpperCase();
    switch (nodeName) {

    //  We use the noncharacters U+FDD0..U+FDD2 as delimiters for links
    //  so that we can pass them through to our ƔAML processor as plain
    //  text.
    case 'A':
      bio.push(`\uFDD0${node.textContent}\uFDD1${node.href}\uFDD2`);
      break;

    //  If our element is a BR, we insert a line break.
    case 'BR':
      bio.push('\n')
      break;

    //  If our element is a P, then we add two line breaks—assuming
    //  that we have processed some text content already.
    case 'P':
      if (bio.length) bio.push('\n\n');
      break;

    //  Otherwise we just push the text.
    default:
      contents.push(node.textContent);
    }
  }

  //  We now have a plain-text, link-delimited version of our bio. We
  //  can parse this as ƔAML.
  const {
    metadata,
    text: parsedText,
  } = readƔaml(bio.join(''));

  //  Next, we generate our result.  We can reüse our `bio` array for
  //  this, now that we don't need its present contents anymore.
  bio.splice();

  //  First, we create paragraphs for our `parsedText`.
  if (parsedText) {
    bio.concat(parsedText.split('\n\n').map(
      (paragraph, index) => (
        <p key={index}>
          {paragraph.text.split('\n').reduce(parseLines, [])}
        </p>
      )
    ));
  }

  //  If we have `metadata`, then we need to process it.
  if (metadata) {
    bio.push(
      <table
        className='metadata'
        key={bio.length}
      >
        <tbody>
          {
            //  We map our metadata arrays into table rows. We use
            //  `parseLines` to make sure our links get parsed.
            metadata.map(
              (data, index) => (
                <tr key={index}>
                  <th scope='row'>{[data[0]].reduce(parseLines, [])}</th>
                  <td>{[data[1]].reduce(parseLines, [])}</td>
                </tr>
              )
            )
          }
        </tbody>
      </table>
    );
  }

  //  Finally, we can render the bio.
  return (
    <div
      className={computedClass}
      {...rest}
    >{bio}</div>
  );
};

//  Props.
ParseStatusContent.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
};
