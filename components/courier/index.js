import classNames from 'classnames'
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, FormattedMessage } from 'react-intl';

import { NotificationContainer } from 'themes/mastodon-go/components';

import {
  CommonHeader,
  CommonList,
  CommonLoadbar,
} from 'themes/mastodon-go/components';

import CourierMenu from './menu';
import CourierPane from './pane';

import './style';

import { POST_TYPE } from 'themes/mastodon-go/util/constants';

const messages = defineMessages({
  courier: {
    defaultMessage: "Courier",
    id: "courier.courier",
  }
})

export default class Courier extends React.PureComponent {

  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    path: PropTypes.string.isRequired,
    '🛄': PropTypes.shape({ intl: PropTypes.object.isRequired }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func).isRequired,
    '🏪': PropTypes.shape({
      isLoading: PropTypes.bool,
      notifications: ImmutablePropTypes.list,
      rainbow: ImmutablePropTypes.map,
      settings: ImmutablePropTypes.map,
    }).isRequired,
  };
  state = { storedHash: '#' };
  node = null;

  constructor (props) {
    super(props);
    const { '💪': { fetch } } = this.props;
    fetch();
  }

  handleLoadMore = () => {
    const { '💪': { expand } } = this.props;
    expand();
  }

  handleSetHash = (hash) => {
    this.setState({ storedHash: hash });
  }

  setRef = node => this.node = node;

  render () {
    const {
      handleSetHash,
      setRef,
    } = this;
    const {
      activeRoute,
      className,
      hash,
      history,
      intl,
      path,
      '🛄': { intl },
      '💪': handler,
      '🏪': {
        isLoading,
        notifications,
        rainbow,
        settings,
      },
      ...rest
    } = this.props;
    const { storedHash } = this.state;

    const computedClass = classNames('MASTODON_GO--COURIER', className);
    const computedHash = activeRoute ? hash : storedHash;

    return (
      <div
        className={computedClass}
        ref={setRef}
        {...rest}
      >
        <CourierMenu
          activeRoute={activeRoute}
          hash={computedHash}
          history={history}
          intl={intl}
          onSetHash={handleSetHash}
          rainbow={rainbow}
          title={intl.formatMessage(messages.courier)}
        />
        <CommonHeader
          backgroundImage={`linear-gradient(160deg, ${rainbow.get('7').join(', ')})`}
          colour={rainbow.get('1')}
        ><FormattedMessage {...messages.courier} /></CommonHeader>
        <CommonList>
          {notifications ? notifications.reduce(
            (items, id) => items.push(
              <NotificationContainer
                hideIf={(settings.getIn(['shows', 'favourite']) && POST_TYPE.IS_FAVOURITE) | (settings.getIn(['shows', 'reblog']) && POST_TYPE.IS_REBLOG) | (settings.getIn(['shows', 'mention']) && POST_TYPE.IS_MENTION) | (settings.getIn(['shows', 'follow']) && POST_TYPE.IS_FOLLOW)}
                id={id}
                key={id}
              />
            ),
            []
          ) : null}
        </CommonList>
        <CourierPane
          hash={computedHash}
          intl={intl}
        />
        {isLoading ? (
          <CommonLoadbar backgroundImage:={`linear-gradient(90deg, ${rainbow.get('15').join(', ')}, ${rainbow.getIn(['15', 0])})`} />
        ) : null}
      </div>
    );
  }

}
