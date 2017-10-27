//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  DOM imports.
import { DOMEventNavigate } from 'themes/mastodon-go/DOM';

//  Component imports.
import {
  CommonButton,
  ConnectedAccount,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class PanelledStartContents extends React.Component {  //  Impure

  constructor (props) {
    super(props);

    this.handleCompose = DOMEventNavigate.bind(this, '/compose');
    this.handleCourier = DOMEventNavigate.bind(this, '/courier');
    this.handleGlobal = DOMEventNavigate.bind(this, '/global');
    this.handleHome = DOMEventNavigate.bind(this, '/home');
    this.handleLocal = DOMEventNavigate.bind(this, '/local');
  }

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

    return (
      <div className={computedClass}>
        {me ? <ConnectedAccount id={me} /> : null}
        <nav>
          <h2>{ℳ.personal}</h2>
          <CommonButton
            icon='pencil-square'
            onClick={handleCompose}
            role='link'
            showTitle
            title={ℳ.compose}
          />
          <CommonButton
            icon='star-half-o'
            onClick={handleCourier}
            role='link'
            showTitle
            title={ℳ.courier}
          />
          <CommonButton
            href='/settings/preferences'
            icon='cog'
            showTitle
            title={ℳ.preferences}
          />
        </nav>
        <nav>
          <h2>{ℳ.timelines}</h2>
          <CommonButton
            icon='home'
            onClick={handleHome}
            role='link'
            showTitle
            title={ℳ.home}
          />
          <CommonButton
            icon='globe'
            onClick={handleGlobal}
            role='link'
            showTitle
            title={ℳ.global}
          />
          <CommonButton
            icon='users'
            onClick={handleLocal}
            role='link'
            showTitle
            title={ℳ.local}
          />
        </nav>
        <nav>
          <h2>{ℳ.meta}</h2>
          <CommonButton
            href='/about/more'
            icon='book'
            showTitle
            title={ℳ.about}
          />
          <CommonButton
            href='/auth/sign_out'
            icon='sign-out'
            showTitle
            title={ℳ.logout}
          />
        </nav>
      </div>
    );
  }

}

PanelledStartContents.propTypes = {
  className: PropTypes.string,
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({ me: PropTypes.string }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func),
};
