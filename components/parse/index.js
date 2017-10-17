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

//  Component imports.
import ParseAccountBio from './account_bio';
import ParseEmoji from './emoji';
import ParseStatusContent from './status_content';

//  Stylesheet imports.
import './style';

//  Other imports.
import { Emojifier } from 'themes/mastodon-go/util/emojify';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class Parse extends React.PureComponent {

  //  Props.
  static propTypes = {
    card: ImmutablePropTypes.map,
    className: PropTypes.string,
    history: PropTypes.object,
    mentions: ImmutablePropTypes.list,
    metadata: ImmutablePropTypes.list,
    tags: ImmutablePropTypes.list,
    text: PropTypes.string,
    type: PropTypes.oneOf([
      'account',
      'emoji',
      'status',
    ]),
    '🛄': PropTypes.shape({ intl: PropTypes.object }),
    '💪': PropTypes.objectOf(PropTypes.func),
    '🏪': PropTypes.shape({ emojos: ImmutablePropTypes.list.isRequired }).isRequired,
  };
  emoji = this.props.type === 'emoji' ? (
    new Emojifier(this.props['🏪'].emojos && this.props['🏪'].emojos.toJS() || [])
  ).emoji : null;

  //  If our `emojos` change, then we need to create new `Emoji`.
  //  (We don't bother with this if our `type` isn't `'emoji'`.)
  componentWillReceiveProps (nextProps) {
    const { '🏪': { emojos } } = this.props;
    if (nextProps.type === 'emoji' && emojos !== nextProps['🏪'].emojos) {
      this.emoji = (
        new Emojifier(nextProps['🏪'].emojos && nextProps['🏪'].emojos.toJS() || [])
      ).emoji;
    }
  }

  //  Rendering.
  render () {
    const { emojifier } = this;
    const {
      card,
      className,
      history,
      mentions,
      metadata,
      tags,
      text,
      type,
      '🛄': { intl },
      '💪': handler,
      '🏪': store,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--PARSE', className);

    //  We just switch over our `type` and render the appropriate
    //  parser.
    switch (type) {
    case 'account':
      return (
        <ParseAccountBio
          className={computedClass}
          metadata={metadata}
          text={text}
          {...rest}
        />
      );
    case 'emoji':
      return (
        <ParseEmoji
          className={computedClass}
          emoji={emoji}
          text={text}
          {...rest}
        />
      );
    case 'status':
      return (
        <ParseStatusContent
          card={card}
          className={computedClass}
          history={history}
          intl={intl}
          mentions={mentions}
          tags={tags}
          text={text}
          {...rest}
        />
      );
    default:
      return null;
    }
  }

}
