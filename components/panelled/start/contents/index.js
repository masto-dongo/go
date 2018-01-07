//  <PanelledStartContents>
//  =======================

//  The start column consists of just a bunch of navigational links.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Event imports.
import { GONavigate } from 'flavours/go/events';

//  Component imports.
import {
  CommonTextButton,
  ConnectedAccount,
} from 'flavours/go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class PanelledStartContents extends React.Component {  //  Impure

  //  Constructor.
  constructor (props) {
    super(props);

    //  Function binding.
    this.handleCompose = GONavigate.bind(this, '/compose');
    this.handleCourier = GONavigate.bind(this, '/courier');
    this.handleGlobal = GONavigate.bind(this, '/global');
    this.handleHome = GONavigate.bind(this, '/home');
    this.handleLocal = GONavigate.bind(this, '/local');
  }

  //  Rendering.
  render () {
    const {
      handleCompose,
      handleCourier,
      handleGlobal,
      handleHome,
      handleLocal,
    } = this;
    const {
      className,
      ℳ,
      '🏪': { me },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--START', className);

    //  Our links are rendered buttony and divided into sections.
    return (
      <div className={computedClass}>
        <ConnectedAccount
          id={me}
          navigable
        />
        <nav>
          <h2>{ℳ.personal}</h2>
          <CommonTextButton
            icon='pencil-square'
            onClick={handleCompose}
            role='link'
          >{ℳ.compose}</CommonTextButton>
          <CommonTextButton
            icon='star-half-o'
            onClick={handleCourier}
            role='link'
          >{ℳ.courier}</CommonTextButton>
          <CommonTextButton
            href='/settings/preferences'
            icon='cog'
          >{ℳ.preferences}</CommonTextButton>
        </nav>
        <nav>
          <h2>{ℳ.timelines}</h2>
          <CommonTextButton
            icon='home'
            onClick={handleHome}
            role='link'
          >{ℳ.home}</CommonTextButton>
          <CommonTextButton
            icon='globe'
            onClick={handleGlobal}
            role='link'
          >{ℳ.global}</CommonTextButton>
          <CommonTextButton
            icon='users'
            onClick={handleLocal}
            role='link'
          >{ℳ.local}</CommonTextButton>
        </nav>
        <nav>
          <h2>{ℳ.meta}</h2>
          <CommonTextButton
            href='/about/more'
            icon='book'
          >{ℳ.about}</CommonTextButton>
          <CommonTextButton
            href='/auth/sign_out'
            icon='sign-out'
          >{ℳ.logout}</CommonTextButton>
        </nav>
      </div>
    );
  }

}

//  Props.
PanelledStartContents.propTypes = {
  className: PropTypes.string,
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({ me: PropTypes.string }).isRequired,  //  The id of the current user's account
};
