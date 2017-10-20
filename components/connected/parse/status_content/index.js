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

//  Component imports.
import ConnectedParseStatusContentParagraph from './paragraph';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ConnectedParseStatusContent ({
  attachments,
  card,
  className,
  history,
  mentions,
  tags,
  text,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--PARSE--STATUS_CONTENT', className);

  //  Most of our processing actually takes place in
  //  `<ParseStatusContentParagraph>`
  return (
    <div
      className={computedClass}
      {...rest}
    >{
        text.split('\n\n').map(
          (paragraph, index) => (
            <ConnectedParseStatusContentParagraph
              attachments={attachments}
              card={card}
              history={history}
              key={index}
              mentions={mentions}
              tags={tags}
              text={paragraph}
            />
          )
        )
     }</div>
  );
};

//  Props.
ConnectedParseStatusContent.propTypes = {
  attachments: ImmutablePropTypes.list,
  card: ImmutablePropTypes.map,
  className: PropTypes.string,
  history: PropTypes.object,
  mentions: ImmutablePropTypes.list,
  tags: ImmutablePropTypes.list,
  text: PropTypes.string.isRequired,
};
