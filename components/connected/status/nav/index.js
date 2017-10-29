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

//  DOM imports.
import { DOMEventNavigate } from 'themes/mastodon-go/DOM';

//  Component imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

export default class ConnectedStatusNav extends React.PureComponent {

  constructor (props) {
    super(props);
    const { id } = this.props;

    //  Function binding.
    this.handleConversation = DOMEventNavigate(`/status/${id}`);
    this.handleReblogs = DOMEventNavigate(`/status/${id}/reblogs`);
    this.handleFavourites = DOMEventNavigate(`/status/${id}/favourites`);
  }

  //  Rendering.
  render () {
    const {
      handleConversation,
      handleReblogs,
      handleFavourites,
    } = this;
    const {
      className,
      favouritesCount,
      id,
      reblogsCount,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--STATUS--NAV', className);

    return (
      <nav className={computedClass}>
        <CommonButton
          icon='comments-o'
          onClick={handleConversation}
          role='link'
          showTitle
          title={ℳ.viewConversation}
        />
        <CommonButton
          icon='retweet'
          onClick={handleReblogs}
          role='link'
          showTitle
          title={ℳ.numReblogs.withValues({ n: reblogsCount || '??' })}
        />
        <CommonButton
          icon='star'
          onClick={handleFavourites}
          role='link'
          showTitle
          title={ℳ.numFavourites.withValues({ n: favouritesCount || '??' })}
        />
      </nav>
    );
  }

}

//  Props.
ConnectedStatusNav.propTypes = {
  className: PropTypes.string,
  favouritesCount: PropTypes.number,
  id: PropTypes.string.isRequired,
  reblogsCount: PropTypes.number,
  ℳ: PropTypes.func,
}
