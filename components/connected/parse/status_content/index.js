//  <ConnectedParseStatusContent>
//  =============================

//  To parse status content, we just break it up into paragraphs and
//  then parse each separately.

//  * * * * * * *  //

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
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ConnectedParseStatusContent ({
  attachments,
  card,
  className,
  emoji,
  mentions,
  tags,
  text,
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--PARSE--STATUS_CONTENT', className);

  //  Most of our processing actually takes place in
  //  `<ParseStatusContentParagraph>`
  return (
    <div className={computedClass}>
      {text.split('\n\n').map(
        (paragraph, index) => (
          <ConnectedParseStatusContentParagraph
            attachments={attachments}
            card={card}
            emoji={emoji}
            key={index}
            mentions={mentions}
            tags={tags}
            text={paragraph}
          />
        )
      )}
    </div>
  );
};

//  Props.
ConnectedParseStatusContent.propTypes = {
  attachments: ImmutablePropTypes.list,  //  The attachments associated with the status
  card: ImmutablePropTypes.map,  //  The card associated with the status
  className: PropTypes.string,
  emoji: ImmutablePropTypes.list,  //  The emoji associated with the status
  mentions: ImmutablePropTypes.list,  //  The mentions associated with the status
  tags: ImmutablePropTypes.list,  //  The tags associated with the status
  text: PropTypes.string.isRequired,  //  The text associated with the status
};
