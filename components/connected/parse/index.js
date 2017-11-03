//  <ConnectedParse>
//  ================

//  This component is a wrapper component for a number of parsers used
//  in various places across _Mastodon GO!_.  The type of parser is
//  specified via the `type` prop, and the needed props for parsing
//  varies depending on the type.  The "account" parser generates a bio
//  from the provided `text`, with account metadata rendered into a
//  table.  The "emoji" parser takes a string and emojifies it
//  according to the passed `emoji` and the global emoji information
//  from the redux store.  The "status" parser takes a deHTMLified
//  string and transforms it into components suitable for insertion
//  into a <ConnectedStatus>.

//  * * * * * * *  //

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
class Parse extends React.Component {  //  Impure

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
      attachments,
      card,
      className,
      emoji: immutableEmoji,
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
          attachments={attachments}
          card={card}
          className={computedClass}
          emoji={immutableEmoji}
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
  attachments: ImmutablePropTypes.list,  //  The attachments associated with the status, for status parsers
  card: ImmutablePropTypes.map,  //  The card associated with the status, for status parsers
  className: PropTypes.string,
  emoji: ImmutablePropTypes.list,  //  The custom emoji to use with the parser
  mentions: ImmutablePropTypes.list,  //  The mentions associated with the status, for status parsers
  metadata: ImmutablePropTypes.list,  //  The metadata associated with the account, for account parsers
  tags: ImmutablePropTypes.list,  //  The tags associated with the status, for status parsers
  text: PropTypes.string,  //  The text to parse
  type: PropTypes.oneOf(['account', 'emoji', 'status']),  //  The type of the parser
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    autoplay: ImmutablePropTypes.bool,  //  Whether to autoplay animated emoji
    globalEmoji: ImmutablePropTypes.list,  //  Global emoji for use with parseïng
  }).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
var ConnectedParse = connect(

  //  Component.
  Parse,

  //  Store.
  createStructuredSelector({
    autoplay: state => state.getIn(['meta', 'autoplay']),
    globalEmoji: state => state.getIn(['emoji', 'global']),
  })
);

//  Exporting.
export { ConnectedParse as default };
