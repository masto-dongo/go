/*********************************************************************\
|                                                                     |
|   <ParseStatusContentParagraph>                                     |
|   =============================                                     |
|                                                                     |
|   This simple functional component converts a single paragraph of   |
|   plain-text status content into a React component suitable for a   |
|   `<Status>`.                                                       |
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

//  Component imports.
import {
  CommonLink,
  ConnectedParse,
  ConnectedReference,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ConnectedParseStatusContentParagraph ({
  attachments,
  card,
  className,
  mentions,
  text,
  tags,
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--PARSE--STATUS_CONTENT--PARAGRAPH', className);

  //  Rendering.
  return (
    <p className={computedClass}>
      {text.split('\n').reduce(
        (pContents, line, lineNº, lines) => {

          //  First, we need to parse our line for any links.
          let linkMatch;
          while ((linkMatch = line.match(/([^]*?)\uFDD0([^]*)\uFDD1([^]*)\uFDD2([^]*)/))) {

            //  If there is text before the link, we push it.
            if (linkMatch[1]) {
              pContents.push(
                <ConnectedParse
                  key={pContents.length}
                  text={linkMatch[1]}
                  type='emoji'
                />
              );
            }

            //  Next, we push our link.
            pContents.push(function (content, href) {

              //  Here we detect what kind of link we're dealing with.
              let mention = mentions ? mentions.find(
                item => href === item.get('href')
              ) : null;
              let tag = tags ? tags.find(
                item => href === item.get('href')
              ) : null;
              let attachment = attachments ? attachments.find(
                item => href === item.getIn(['src', 'original']) || href === item.getIn(['src', 'remote']) || href === item.get(['src', 'shortlink'])
              ) : null;

              //  We use a switch to select our link type.
              switch (true) {

              //  This handles cards.
              case card && href === card.get('href'):
                return (
                  <ConnectedReference
                    card={card.get('id')}
                    key={pContents.length}
                  />
                );

              //  This handles mentions.
              case mention && (content.replace(/^@/, '') === mention.get('username') || content.replace(/^@/, '') === mention.get('at')):
                return (
                  <ConnectedReference
                    key={pContents.length}
                    mention={mention.get('id')}
                    showAt={content[0] === '@'}
                  />
                );

              //  This handles attachment links.
              case !!attachment:
                return (
                  <ConnectedReference
                    attachment={attachment.get('id')}
                    key={pContents.length}
                  />
                );

              //  This handles hashtag links.
              case !!tag && (content.replace(/^#/, '') === tag.get('name')):
                return (
                  <ConnectedReference
                    key={pContents.length}
                    tagName={tag.get('name')}
                    showHash={content[0] === '#'}
                  />
                );

              //  This handles all other links.
              default:
                if (content === href && content.length > 23) {
                  content = content.substr(0, 22) + '…';
                }
                return (
                  <CommonLink
                    className='link'
                    href={href}
                    key={pContents.length}
                    title={href}
                  >
                    <ConnectedParse
                      text={content}
                      type='emoji'
                    />
                  </CommonLink>
                );
              }
            }(linkMatch[2], linkMatch[3]));

            //  Finally, we reset our `line` to our remaining contents.
            line = linkMatch[4];
          }

          //  If any text remains in our line, we push it.
          if (line) {
            pContents.push(
              <ConnectedParse
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
        },
        []
      )}
    </p>
  );
};

//  Props.
ConnectedParseStatusContentParagraph.propTypes = {
  attachments: ImmutablePropTypes.list,
  card: ImmutablePropTypes.map,
  className: PropTypes.string,
  mentions: ImmutablePropTypes.list,
  tags: ImmutablePropTypes.list,
  text: PropTypes.string,
};
