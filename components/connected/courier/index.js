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
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  CommonList,
  ConnectedNotification,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  Request imports.
import {
  connectCourier,
  expandCourier,
  fetchCourier,
  refreshCourier,
  clearNotification,
  deleteNotification,
} from 'themes/mastodon-go/redux';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';
import { POST_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * * //

//  The component
//  -------------

//  Component definition.
class Courier extends React.PureComponent {

  //  Constructor.  We go ahead and prefetch the notifications,
  //  forgetting about any previously-loaded ones.  There shouldn't
  //  ever be two notification timelines on the screen at once so
  //  this shouldn't cause a problem.
  constructor (props) {
    super(props);

    //  Notification fetching.
    const { '💪': { fetch } } = this.props;
    fetch();
  }

  //  Rendering.
  render () {
    const {
      className,
      '🏪': {
        isLoading,
        notifications,
        settings,
      },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COURIER', className);

    return (
      <CommonList
        className={computedClass}
        isLoading={isLoading}
      >
        {notifications ? notifications.reduce(
          (items, id) => items.push(
            <ConnectedNotification
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

//  Props.
Courier.propTypes = {
  activeRoute: PropTypes.bool,
  className: PropTypes.string,
  history: PropTypes.object,
  rehash: PropTypes.func,
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    isLoading: PropTypes.bool,
    notifications: ImmutablePropTypes.list,
    settings: ImmutablePropTypes.map,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

var ConnectedCourier = connect(

  //  Component.
  Courier,

  //  Store.
  createStructuredSelector({
    isLoading: state => state.getIn(['courier', 'isLoading']),
    notifications: state => state.getIn(['courier', 'notifications']),
    settings: (state, { column }) => column ? state.getIn(['setting', 'global', 'courier']) : null,
  }),

  //  Messages.
  null,

  //  Handler.
  go => ({
    clear: () => go(clearNotification),
    connect: () => go(connectCourier),
    delete: ids => go(deleteNotification, ids),
    expand: () => go(expandCourier),
    fetch: () => go(fetchCourier),
    refresh: () => go(refreshCourier),
  })
);

export { ConnectedCourier as default };
