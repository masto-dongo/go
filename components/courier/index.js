/*********************************************************************\
|                                                                     |
|   <Courier>                                                         |
|   =========                                                         |
|                                                                     |
|   Couriers are like timelines only for notifications!  I took the   |
|   name "courier" from monsterpit.net since upstream just calls it   |
|   "notifications", which is confusing when you also have singular   |
|   `<Notification>` components.                                      |
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
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  defineMessages,
  FormattedMessage,
} from 'react-intl';

//  Container imports.
import { NotificationContainer } from 'themes/mastodon-go/components';

//  Component imports.
import CourierMenu from './menu';
import CourierPanel from './panel';

//  Common imports.
import {
  CommonList,
  CommonPaneller,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Other imports.
import { POST_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * * //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  courier: {
    defaultMessage: 'Courier',
    id: 'courier.courier',
  },
});

//  * * * * * * * //

//  The component
//  -------------

//  Component definition.
export default class Courier extends React.PureComponent {

  //  Props and state.
  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    column: PropTypes.bool,
    hash: PropTypes.string,
    history: PropTypes.object,
    path: PropTypes.string.isRequired,
    '🛄': PropTypes.shape({ intl: PropTypes.object.isRequired }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func).isRequired,
    '🏪': PropTypes.shape({
      isLoading: PropTypes.bool,
      notifications: ImmutablePropTypes.list,
      settings: ImmutablePropTypes.map,
    }).isRequired,
  };
  state = { storedHash: '#' };
  node = null;

  //  Constructor.  We go ahead and prefetch the notifications,
  //  forgetting about any previously-loaded ones.  There shouldn't
  //  ever be two notification timelines on the screen at once so
  //  this shouldn't cause a problem.
  constructor (props) {
    super(props);
    const { '💪': { fetch } } = this.props;
    fetch();
  }

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

  //  Loads more lol.
  handleLoadMore = () => {
    const { '💪': { expand } } = this.props;
    expand();
  };

  //  A quick function to set our hash.
  handleSetHash = hash => this.setState({ storedHash: hash });

  //  Rendering.
  render () {
    const { handleSetHash } = this;
    const {
      activeRoute,
      className,
      column,
      hash,
      history,
      path,
      '🛄': { intl },
      '💪': handler,
      '🏪': {
        isLoading,
        notifications,
        settings,
      },
      ...rest
    } = this.props;
    const { storedHash } = this.state;
    const computedClass = classNames('MASTODON_GO--COURIER', { list: !column }, className);

    //  We only use our internal hash if this isn't the active route.
    const computedHash = activeRoute ? hash : storedHash;

    //  Rendering.
    if (column) {
      return (
        <CommonPaneller
          className={computedClass}
          menu={
            <CourierMenu
              activeRoute={activeRoute}
              hash={computedHash}
              history={history}
              intl={intl}
              onSetHash={handleSetHash}
              title={intl.formatMessage(messages.courier)}
            />
          }
          panel={<CourierPanel hash={computedHash} />}
          title={<FormattedMessage {...messages.courier} />}
          {...rest}
        >
          <CommonList isLoading={isLoading}>
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
        </CommonPaneller>
      );
    }

    return (
      <CommonList
        className={computedClass}
        isLoading={isLoading}
        {...rest}
      >
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
    );
  }

}
