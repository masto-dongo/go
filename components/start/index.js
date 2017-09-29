//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';

//  Our imports.
import {
  CommonButton,
  CommonHeader,
} from 'themes/mastodon-go/components';

import { RAINBOW } from 'themes/mastodon-go/util/constants';
import rainbow from 'themes/mastodon-go/util/rainbow';

//  Stylesheet imports.
import './style';

const messages = defineMessages({
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
  yours: {
    defaultMessage: 'Your account',
    id: 'start.yours'
  },
})

//  * * * * * * *  //

//  The component
//  -------------

export default class Start extends React.PureComponent { 

  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    intl: PropTypes.object.isRequired,
    me: PropTypes.string,
    myRainbow: ImmutablePropTypes.map,
  }

  render () {
    const {
      activeRoute,
      className,
      hash,
      history,
      intl,
      me,
      myRainbow,
      ...rest
    } = this.props;
 
    const computedClass = classNames('MASTODON_GO--START', className);

    return (
      <div
        className={computedClass}
        {...rest}
      >
        <CommonMenu>
          <CommonButton
            active
            href={activeRoute ? '#' : void 0}
            icon='mouse-pointer'
            proportional
            style={true ? { backgroundImage: `linear-gradient(160deg, ${rainbow(RAINBOW.START, 3).join(', ')})` } : { color: rainbow(RAINBOW.START) }}
            title={intl.formatMessage(messages.start)}
          />
        </CommonMenu>
        <CommonHeader backgroundImage={`linear-gradient(160deg, ${rainbow(RAINBOW.START, 7).join(', ')})`}>
          <FormattedMessage {...messages.start} />
        </CommonHeader>
        <nav>
          <h2><FormattedMessage {...messages.personal} /></h2>
          {me ? (
            <CommonButton
              destination={`profile/${me}`}
              history={history}
              icon='user'
              iconColour={myRainbow ? myRainbow.get('1') : void 0}
              showTitle
              title={intl.formatMessage(messages.yours)}
            />
          ) : null}
          <CommonButton
            destination='/compose'
            history={history}
            icon='pencil-square-o'
            iconColour={rainbow(RAINBOW.COMPOSE)}
            showTitle
            title={intl.formatMessage(messages.compose)}
          />
          <CommonButton
            href='/settings/preferences'
            icon='cog'
            iconColour={rainbow(RAINBOW.PREFERENCES)}
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
            iconColour={rainbow(RAINBOW.HOME)}
            showTitle
            title={intl.formatMessage(messages.home)}
          />
          <CommonButton
            destination='/global'
            history={history}
            icon='globe'
            iconColour={rainbow(RAINBOW.GLOBAL)}
            showTitle
            title={intl.formatMessage(messages.global)}
          />
          <CommonButton
            destination='/local'
            history={history}
            icon='users'
            iconColour={rainbow(RAINBOW.LOCAL)}
            showTitle
            title={intl.formatMessage(messages.local)}
          />
        </nav>
      </div>
    );
  }

}
