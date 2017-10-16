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

//  Container imports.
import { ParseContainer } from 'themes/mastodon-go/components';

//  Common imports.
import { CommonLink } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Other imports.
import { MEDIA_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ParseStatusContentParagraph ({
  attachments,
  card,
  className,
  mentions,
  text,
  tags,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--PARSE--STATUS_CONTENT--PARAGRAPH', className);

  //  Rendering.
  return (
    <p
      className={computedClass}
      {...rest}
    >
      {
        text.split('\n').reduce(
          (pContents, line, lineNº, lines) => {

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
                    <ReferenceContainer
                      card={card.get('id')}
                      history={history}
                      key={pContents.length}
                    />
                  );

                //  This handles mentions.
                case mention && (content.replace(/^@/, '') === mention.get('username') || content.replace(/^@/, '') === mention.get('at')):
                  return (
                    <ReferenceContainer
                      key={pContents.length}
                      history={history}
                      mention={mention.get('id')}
                      showAt={content[0] === '@'}
                    />
                  );

                //  This handles attachment links.
                case !!attachment:
                    return (
                      <ReferenceContainer
                        attachment={attachment.get('id')}
                        history={history}
                        key={pContents.length}
                      />
                    )

                //  This handles hashtag links.
                case !!tag && (content.replace(/^#/, '') === tag.get('name')):
                  return (
                    <ReferenceContainer
                      history={history}
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
                      <ParseContainer
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
          },
          []
        )
      }
    </p>
  );
};

//  Props.
ParseStatusContent.propTypes = {
  attachments: ImmutablePropTypes.list,
  card: ImmutablePropTypes.map,
  className: PropTypes.string,
  history: PropTypes.object,
  mentions: ImmutablePropTypes.list,
  tags: ImmutablePropTypes.list,
  text: PropTypes.string,
};
