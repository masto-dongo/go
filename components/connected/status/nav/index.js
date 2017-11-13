//  <ConnectedStatusNav>
//  ====================

//  This component lets you see status counts and navigate to related
//  columns.

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
import { CommonTextButton } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ConnectedStatusNav extends React.PureComponent {

  //  Constructor.
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
      reblogsCount,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--STATUS--NAV', className);

    //  We just render our buttons in a row.
    return (
      <nav className={computedClass}>
        <CommonTextButton
          icon='comments-o'
          onClick={handleConversation}
          proportional
          role='link'
          title={ℳ.viewConversation}
        />
        <CommonTextButton
          icon='retweet'
          onClick={handleReblogs}
          proportional
          role='link'
          title={ℳ('numReblogs', { n: reblogsCount === +reblogsCount ? reblogsCount : '??' })}
        >{reblogsCount === +reblogsCount ? ' ' + reblogsCount : ' ??'}</CommonTextButton>
        <CommonTextButton
          icon='star'
          onClick={handleFavourites}
          proportional
          role='link'
          title={ℳ('numFavourites', { n: favouritesCount === +favouritesCount ? favouritesCount : '??' })}
        >{favouritesCount === +favouritesCount ? ' ' + favouritesCount : ' ??'}</CommonTextButton>
      </nav>
    );
  }

}

//  Props.
ConnectedStatusNav.propTypes = {
  className: PropTypes.string,
  favouritesCount: PropTypes.number,  //  The number of favourites for the status
  id: PropTypes.string.isRequired,  //  The status id
  reblogsCount: PropTypes.number,  //  The number of reblogs for the status
  ℳ: PropTypes.func,
};
