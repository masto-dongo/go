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
    this.handleConversation = DOMEventNavigate.bind(this, `/status/${id}`);
    this.handleReblogs = DOMEventNavigate.bind(this, `/status/${id}/reblogs`);
    this.handleFavourites = DOMEventNavigate.bind(this, `/status/${id}/favourites`);
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
          proportional
          role='link'
          title={ℳ.viewConversation}
        />
        <CommonButton
          icon='retweet'
          onClick={handleReblogs}
          proportional
          role='link'
          title={ℳ.numReblogs.withValues({ n: reblogsCount === +reblogsCount ? reblogsCount : '??' })}
        >{reblogsCount === +reblogsCount ? ' ' + reblogsCount : ' ??'}</CommonButton>
        <CommonButton
          icon='star'
          onClick={handleFavourites}
          proportional
          role='link'
          title={ℳ.numFavourites.withValues({ n: favouritesCount === +favouritesCount ? favouritesCount : '??' })}
        >{favouritesCount === +favouritesCount ? ' ' + favouritesCount : ' ??'}</CommonButton>
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
