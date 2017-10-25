//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import { CommonToggle } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import { VISIBILITY } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ConnectedPreviewToggles extends React.PureComponent {

  constructor (props) {
    super(props);

    //  Function binding.
    const {
      handleDirect,
      handleFederated,
      handleListed,
      handleRebloggable,
    } = Object.getPrototypeOf(this);
    this.handleDirect = handleDirect.bind(this);
    this.handleFederated = handleFederated.bind(this);
    this.handleListed = handleListed.bind(this);
    this.handleRebloggable = handleRebloggable.bind(this);
  }

  handleFederated (value) {
    const {
      onVisibility,
      visibility,
    } = this;
    if (!onVisibility) {
      return;
    }
    onVisibility(value ? visibility | VISIBILITY.FEDERATED : visibility & ~VISIBILITY.FEDERATED);
  }
  handleRebloggable (value) {
    const {
      onVisibility,
      visibility,
    } = this;
    if (!onVisibility) {
      return;
    }
    onVisibility(value ? visibility | VISIBILITY.NON_FOLLOWERS | VISIBILITY.REBLOGGABLE : visibility & ~VISIBILITY.NON_FOLLOWERS & ~VISIBILITY.REBLOGGABLE & ~VISIBILITY.LISTED);
  }
  handleListed (value) {
    const {
      onVisibility,
      visibility,
    } = this;
    if (!onVisibility) {
      return;
    }
    onVisibility(value ? visibility | VISIBILITY.NON_FOLLOWERS | VISIBILITY.REBLOGGABLE | VISIBILITY.LISTED : visibility & ~VISIBILITY.LISTED);
  }
  handleDirect (value) {
    const {
      onVisibility,
      visibility,
    } = this;
    if (!onVisibility) {
      return;
    }
    onVisibility(value ? visibility & VISIBILITY.DIRECT : visibility | VISIBILITY.FOLLOWERS | VISIBILITY.PROFILE);
  }

  render () {
    const {
      handleDirect,
      handleFederated,
      handleListed,
      handleRebloggable,
    } = this;
    const {
      className,
      visibility,
      onVisibility,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--PREVIEW--TOGGLES', className);

    //  Rendering.
    return (
      <div className={computedClass}>
        <CommonToggle
          active={visibility & VISIBILITY.FEDERATED}
          activeIcon='globe'
          activeLabel={ℳ.federatedOn}
          inactiveIcon='users'
          inactiveLabel={ℳ.federatedOff}
          onChange={handleFederated}
        />
        <CommonToggle
          active={visibility & VISIBILITY.REBLOGGABLE}
          activeIcon='unlock-alt'
          activeLabel={ℳ.reblogOn}
          inactiveIcon='lock'
          inactiveLabel={ℳ.reblogOff}
          onChange={handleRebloggable}
        />
        <CommonToggle
          active={visibility & VISIBILITY.LISTED}
          activeIcon='newspaper-o'
          activeLabel={ℳ.listedOn}
          inactiveIcon='microphone-slash'
          inactiveLabel={ℳ.listedOff}
          onChange={handleListed}
        />
        <CommonToggle
          active={!(visibility & ~VISIBILITY.DIRECT)}
          activeIcon='envelope'
          activeLabel={ℳ.directOn}
          inactiveIcon='envelope-open'
          inactiveLabel={ℳ.directOff}
          onChange={handleDirect}
        />
      </div>
    );
  }

}

//  Props.
PanelledCourierSettings.propTypes = {
  className: PropTypes.string,
  onVisibility: PropTypes.func,
  visibility: PropTypes.number,
  ℳ: PropTypes.func.isRequired,
};
