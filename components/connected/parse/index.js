/*********************************************************************\
|                                                                     |
|   <Parse>                                                           |
|   =======                                                           |
|                                                                     |
|   <Parse> is a wrapper component for a number of parsers employed   |
|   in various places across _Mastodon GO!_.  The type of parser is   |
|   specified via the `type` prop, and the needed props for parsing   |
|   varies depending on type.  The "account" parser generates a bio   |
|   from the provided `text`, with account metadata rendered into a   |
|   table.  The "emoji" parser takes a string and replaces segments   |
|   with emoji as defined by the `emoji` information from the redux   |
|   store.  The "status" parser takes an HTML string and transforms   |
|   it into components suitable for insertion into a <Status>.  The   |
|   "text" parser takes an HTML string and produces plain text.       |
|                                                                     |
|   The `mentions`, `tags`, and `card` props are used by the status   |
|   parser to appropriately render those sorts of links.  Our emoji   |
|   data is only handled by the emoji parser (which is contained by   |
|   other parsers as well).                                           |
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
import { createStructuredSelector } from 'reselect';

//  Component imports.
import ConnectedParseAccountBio from './account_bio';
import ConnectedParseEmoji from './emoji';
import ConnectedParseStatusContent from './status_content';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class Parse extends React.PureComponent {

  constructor (props) {
    super(props);
    const {
      emoji,
      type,
      '🏪': { globalEmoji },
    } = this.props;

    //  Variables.
    this.emoji = type === 'emoji' ? function () {
      const emojos = [];
      if (emoji) {
        emojos.push(emoji.toJS());
      }
      if (globalEmoji) {
        emojos.push(globalEmoji.toJS());
      }
      return Array.prototype.concat.apply([], emojos);
    }() : null;
  }

  //  Rendering.
  render () {
    const { emoji } = this;
    const {
      card,
      className,
      mentions,
      metadata,
      tags,
      text,
      type,
      '🏪': { autoplay },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--PARSE', className);

    //  We just switch over our `type` and render the appropriate
    //  parser.
    switch (type) {
    case 'account':
      return (
        <ConnectedParseAccountBio
          className={computedClass}
          metadata={metadata}
          text={text}
        />
      );
    case 'emoji':
      return (
        <ConnectedParseEmoji
          autoplay={autoplay}
          className={computedClass}
          emoji={emoji}
          text={text}
        />
      );
    case 'status':
      return (
        <ConnectedParseStatusContent
          card={card}
          className={computedClass}
          mentions={mentions}
          tags={tags}
          text={text}
        />
      );
    default:
      return null;
    }
  }

}

//  Props.
Parse.propTypes = {
  card: ImmutablePropTypes.map,
  className: PropTypes.string,
  emoji: ImmutablePropTypes.list,
  mentions: ImmutablePropTypes.list,
  metadata: ImmutablePropTypes.list,
  tags: ImmutablePropTypes.list,
  text: PropTypes.string,
  type: PropTypes.oneOf([
    'account',
    'emoji',
    'status',
  ]),
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    autoplay: ImmutablePropTypes.bool,
    globalEmoji: ImmutablePropTypes.list.isRequired,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func),
};

//  * * * * * * *  //

//  Connecting
//  ----------

var ConnectedParse = connect(

  //  Component.
  Parse,

  //  Store.
  createStructuredSelector({
    autoplay: state => state.getIn(['meta', 'autoplay']),
    globalEmoji: state => state.getIn(['emoji', 'global']),
  })
);

export { ConnectedParse as default };
