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

//  Component imports.
import {
  CommonIcon,
  CommonLink,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

export default class ConnectedStatusNav extends React.PureComponent {

  //  Props.
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    ℳ: PropTypes.func,
  }

  //  Rendering.
  render () {
    const {
      className,
      id,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--STATUS--NAV', className);

    return (
      <nav className={computedClass}>
        <CommonLink title={ℳ.viewConversation}>
          <CommonIcon name='comments-o' />
        </CommonLink>
        <CommonLink title={ℳ.viewReblogs}>
          <CommonIcon name='retweet' />
        </CommonLink>
        <CommonLink title={ℳ.viewFavourites}>
          <CommonIcon name='star' />
        </CommonLink>
      </nav>
    );
  }

}
