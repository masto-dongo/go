//  <StatusNav>
//  ========

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages } from 'react-intl';

//  Our imports.
import CommonIcon from 'themes/mastodon-go/components';
import CommonLink from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Localization messages.
const messages = defineMessages({
  conversation:
    { id : 'status.view_conversation', defaultMessage : 'View conversation' },
  reblogs:
    { id : 'status.view_reblogs', defaultMessage : 'View reblogs' },
  favourites:
    { id : 'status.view_favourites', defaultMessage : 'View favourites' },
});

//  * * * * * * *  //

//  The component
//  -------------

export default class StatusNav extends React.PureComponent {

  //  Props.
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.number.isRequired,
    intl: PropTypes.object.isRequired,
  }

  //  Rendering.
  render () {
    const {
      className,
      id,
      intl,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--STATUS--NAV', className);

    return (
      <nav className={computedClass}>
        <CommonLink
          title={intl.formatMessage(messages.conversation)}
        >
          <CommonIcon name='comments-o'/>
        </CommonLink>
        <CommonLink
          title={intl.formatMessage(messages.reblogs)}
        >
          <CommonIcon
            name='retweet'
          />
        </CommonLink>
        <CommonLink
          title={intl.formatMessage(messages.favourites)}
        >
          <CommonIcon
            name='star'
          />
        </CommonLink>
      </nav>
    );
  }

}
