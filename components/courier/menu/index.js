/*********************************************************************\
|                                                                     |
|   <CourierMenu>                                                     |
|   =============                                                     |
|                                                                     |
|   The courier menu allows users to toggle between the normal view   |
|   and the settings pane.                                            |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames'
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';

//  Common imports.
import {
  CommonButton,
  CommonMenubar,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  settings: {
    defaultMessage: "Settings",
    id: "courier.settings",
  }
});

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class CourierMenu extends React.PureComponent {

  //  Props.
  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    intl: PropTypes.object.isRequired,
    onSetHash: PropTypes.func,
    rainbow: ImmutablePropTypes.map.isRequired,
    title: PropTypes.string,
  };

  //  Click handlers.
  handleCourierClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#')
    }
  }
  handleSettingsClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#settings')
    }
  }

  //  Rendering.
  render () {
    const {
      handleTimelineClick,
      handleSettingsClick,
    } = this;
    const {
      activeRoute,
      className,
      hash,
      history,
      intl,
      onSetHash,
      rainbow,
      title,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--COURIER--MENU', className);

    //  These are our possible hashes.
    const hashes = ['#', '#settings'];

    return (
      <CommonMenubar
        className={computedClass}
        {...rest}
      >
        <CommonButton
          active
          destination={activeRoute ? '#' : undefined}
          history={history}
          icon='bell'
          onClick={!activeRoute ? handleCourierClick : undefined}
          style={hash === '#' || hashes.indexOf(hash) === -1 ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('3').join(', ')})` } : { color: rainbow.get('1') }}
          title={title}
        />
        <CommonButton
          active
          destination={activeRoute ? '#settings' : undefined}
          history={history}
          icon='toggles'
          onClick={!activeRoute ? handleSettingsClick : undefined}
          style={hash === '#settings' ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('3').join(', ')})` } : { color: rainbow.get('1') }}
          title={intl.formatMessage(messages.settings)}
        />
      </CommonMenubar>
    );
  }

}
