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
import classNames from 'classnames';
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
    defaultMessage: 'Settings',
    id: 'courier.settings',
  },
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
    title: PropTypes.string,
  };

  //  Click handlers.
  handleCourierClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#');
    }
  };
  handleSettingsClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#settings');
    }
  };

  //  Rendering.
  render () {
    const {
      handleCourierClick,
      handleSettingsClick,
    } = this;
    const {
      activeRoute,
      className,
      hash,
      history,
      intl,
      onSetHash,
      title,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--COURIER--MENU', className);

    return (
      <CommonMenubar
        activeRoute={activeRoute}
        className={computedClass}
        history={history}
        intl={intl}
        {...rest}
      >
        <CommonButton
          active={!hash || hash === '#'}
          destination={activeRoute ? '#' : undefined}
          history={history}
          icon='star-half-o'
          onClick={!activeRoute ? handleCourierClick : undefined}
          title={title}
        />
        <CommonButton
          active={hash === '#settings'}
          destination={activeRoute ? '#settings' : undefined}
          history={history}
          icon='toggles'
          onClick={!activeRoute ? handleSettingsClick : undefined}
          title={intl.formatMessage(messages.settings)}
        />
      </CommonMenubar>
    );
  }

}
