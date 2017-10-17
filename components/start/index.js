//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

//  Container imports.
import { AccountContainer } from 'themes/mastodon-go/components';

//  Component imports.
import StartMenu from './menu';

//  Common imports.
import {
  CommonButton,
  CommonPaneller,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  about: {
    defaultMessage: 'About this instance',
    id: 'start.about',
  },
  compose: {
    defaultMessage: 'Compose',
    id: 'start.compose',
  },
  global: {
    defaultMessage: 'Federated timeline',
    id: 'start.global',
  },
  home: {
    defaultMessage: 'Home',
    id: 'start.home',
  },
  local: {
    defaultMessage: 'Community timeline',
    id: 'start.local',
  },
  logout: {
    defaultMessage: 'Logout',
    id: 'start.logout',
  },
  meta: {
    defaultMessage: 'Meta',
    id: 'start.meta',
  },
  personal: {
    defaultMessage: 'Personal',
    id: 'start.personal',
  },
  preferences: {
    defaultMessage: 'Preferences',
    id: 'start.preferences',
  },
  start: {
    defaultMessage: 'Start',
    id: 'column.start',
  },
  timelines: {
    defaultMessage: 'Timelines',
    id: 'start.timelines',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class Start extends React.PureComponent {

  //  Props.
  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    '🛄': PropTypes.shape({ intl: PropTypes.object.isRequired }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func),
    '🏪': PropTypes.shape({ me: PropTypes.string }).isRequired,
  }
  state = { storedHash: '#' };

  //  If our component is suddenly no longer the active route, we need
  //  to store its hash value before it disappears.
  componentWillReceiveProps (nextProps) {
    const {
      activeRoute,
      hash,
    } = this.props;
    if (activeRoute && !nextProps.activeRoute) {
      this.setState({ storedHash: hash });
    }
  }

  //  This is a tiny function to update our hash if needbe.
  handleSetHash = hash => {
    const { activeRoute } = this;
    if (!activeRoute) {
      this.setState({ storedHash: hash });
    }
  }

  //  Rendering.
  render () {
    const { handleSetHash } = this;
    const {
      activeRoute,
      className,
      hash,
      history,
      '🛄': { intl },
      '💪': handler,
      '🏪': { me },
      ...rest
    } = this.props;
    const { storedHash } = this.state;
    const computedClass = classNames('MASTODON_GO--START', className);

    //  We only use our internal hash if this isn't the active route.
    const computedHash = activeRoute ? hash : storedHash;

    return (
      <CommonPaneller
        className={computedClass}
        menu={
          <StartMenu
            activeRoute={activeRoute}
            hash={computedHash}
            history={history}
            icon='asterisk'
            intl={intl}
            onSetHash={handleSetHash}
            title={intl.formatMessage(messages.start)}
          />
        }
        title={<FormattedMessage {...messages.start} />}
        {...rest}
      >
        <div className='content'>
          {me ? (
            <AccountContainer
              history={history}
              id={me}
            />
          ) : null}
          <nav>
            <h2><FormattedMessage {...messages.personal} /></h2>
            <CommonButton
              destination='/compose'
              history={history}
              icon='pencil-square-o'
              showTitle
              title={intl.formatMessage(messages.compose)}
            />
            <CommonButton
              destination='/courier'
              history={history}
              icon='star-half-o'
              showTitle
              title={intl.formatMessage(messages.compose)}
            />
            <CommonButton
              href='/settings/preferences'
              icon='cog'
              showTitle
              title={intl.formatMessage(messages.preferences)}
            />
          </nav>
          <nav>
            <h2><FormattedMessage {...messages.timelines} /></h2>
            <CommonButton
              destination='/home'
              history={history}
              icon='home'
              showTitle
              title={intl.formatMessage(messages.home)}
            />
            <CommonButton
              destination='/global'
              history={history}
              icon='globe'
              showTitle
              title={intl.formatMessage(messages.global)}
            />
            <CommonButton
              destination='/local'
              history={history}
              icon='users'
              showTitle
              title={intl.formatMessage(messages.local)}
            />
          </nav>
          <nav>
            <h2><FormattedMessage {...messages.meta} /></h2>
            <CommonButton
              href='/about/more'
              icon='book'
              showTitle
              title={intl.formatMessage(messages.about)}
            />
            <CommonButton
              href='/auth/sign_out'
              icon='sign-out'
              showTitle
              title={intl.formatMessage(messages.logout)}
            />
          </nav>
        </div>
      </CommonPaneller>
    );
  }

}
