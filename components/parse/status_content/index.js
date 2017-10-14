/*********************************************************************\
|                                                                     |
|   <ParseStatusContent>                                              |
|   ====================                                              |
|                                                                     |
|   This parser is way more complex than it by all rights should be   |
|   because the Mastodon API doesn't give us statuses in plain text   |
|   and so we have to un-parse their HTML before we can re-parse it   |
|   as React.  We preserve Mastodon's `<p>` and `<br>` elements and   |
|   replace links with our own special components.  Tags, mentions,   |
|   and attachments are rendered as `<Reference>`s, and other links   |
|   are turned into `<CommonLink>`s.                                  |
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

//  Container imports.
import {
  ParseContainer,
  ReferenceContainer,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Other imports.
import { MEDIA_TYPE } from 'themes/mastodon-go/util/constants';
import { DOMParser } from 'themes/mastodon-go/util/polyfills';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ParseStatusContent ({
  attachments,
  card,
  className,
  history,
  intl,
  mentions,
  tags,
  text,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--PARSE--STATUS_CONTENT', className);

  //  This creates a document with the DOM contents of our `text` and a
  //  TreeWalker to walk them. We only care about paragraphs,
  //  line-breaks, and links.
  const parser = new DOMParser;
  const doc = parser.parseFromString(text, 'text/html');
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

  //  These arrays will hold the parsed contents of our `text`.
  const contents = [];
  let currentParagraph = [];

  //  This walks the contents of our status.
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const nodeName = node.nodeName.toUpperCase();
    const paragraphKey = currentParagraph.length;
    switch (nodeName) {

    //  If our element is a link, then we process it here.
    case 'A':
      currentParagraph.push(function (content) {

        //  Here we detect what kind of link we're dealing with.
        let mention = mentions ? mentions.find(
          item => node.href === item.get('href')
        ) : null;
        let tag = tags ? tags.find(
          item => node.href === item.get('href')
        ) : null;
        let attachment = attachments ? attachments.find(
          item => node.href === item.getIn(['src', 'original']) || node.href === item.getIn(['src', 'remote']) || node.href === item.get(['src', 'shortlink'])
        ) : null;

        //  We use a switch to select our link type.
        switch (true) {

        //  This handles cards.
        case card && node.href === card.get('href'):
          return (
            <ReferenceContainer
              card={card.get('id')}
              key={paragraphKey}
            />
          );

        //  This handles mentions.
        case mention && (content.replace(/^@/, '') === mention.get('username') || content.replace(/^@/, '') === mention.get('at')):
          return (
            <ReferenceContainer
              key={paragraphKey}
              mention={mention.get('id')}
              showAt={content[0] === '@'}
            />
          );

        //  This handles attachment links.
        case !!attachment:
            return (
              <ReferenceContainer
                attachment={attachment.get('id')}
                key={paragraphKey}
              />
            )

        //  This handles hashtag links.
        case !!tag && (content.replace(/^#/, '') === tag.get('name')):
          return (
            <ReferenceContainer
              key={paragraphKey}
              tagName={tag.get('name')}
              showHash={content[0] === '#'}
            />
          );

        //  This handles all other links.
        default:
          if (content === node.href && content.length > 23) {
            content = content.substr(0, 22) + '…';
          }
          return (
            <CommonLink
              className='link'
              href={node.href}
              key={paragraphKey}
              title={node.href}
            >
              <ParseContainer
                text={content}
                type='emoji'
              />
            </CommonLink>
          );
        }
      }(node.textContent));
      break;

    //  If our element is a BR, we pass it along.
    case 'BR':
      currentParagraph.push(<br key={paragraphKey} />);
      break;

    //  If our element is a P, then we need to start a new paragraph.
    //  If our current paragraph has content, we need to push it first.
    case 'P':
      if (currentParagraph.length) contents.push(
        <p key={contents.length}>
          {currentParagraph}
        </p>
      );
      currentParagraph = [];
      break;

    //  Otherwise we just push the text.
    default:
      currentParagraph.push(
        <ParseContainer
          text={node.textContent}
          type='emoji'
        />
      );
    }
  }

  //  If there is unpushed paragraph content after walking the entire
  //  status contents, we push it here.
  if (currentParagraph.length) contents.push(
    <p key={contents.length}>
      {currentParagraph}
    </p>
  );

  //  Rendering the status contents:
  return (
    <div
      className={computedClass}
      {...rest}
    >{contents}</div>
  );
};

//  Props.
ParseStatusContent.propTypes = {
  attachments: ImmutablePropTypes.list,
  card: ImmutablePropTypes.map,
  className: PropTypes.string,
  history: PropTypes.object,
  intl: PropTypes.object.isRequired,
  mentions: ImmutablePropTypes.list,
  tags: ImmutablePropTypes.list,
  text: PropTypes.string.isRequired,
};
