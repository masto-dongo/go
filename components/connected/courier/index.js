//  <ConnectedCourier>
//  ==================

//  Couriers are like timelines only for notifications!  I took the
//  name "courier" from monsterpit.net since upstream calls this
//  component "Notifications", which is confusing when you also have
//  singular  `<Notification>` components.

//  * * * * * * * //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  CommonButton,
  CommonList,
  CommonObserveäble,
  ConnectedNotification,
} from 'themes/mastodon-go/components';

//  Request imports.
import {
  connectCourier,
  expandCourier,
  fetchCourier,
  refreshCourier,
  clearNotification,
  deleteNotification,
} from 'themes/mastodon-go/redux';

//  Stylesheet imports.
import './style.scss';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';
import { POST_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * * //

//  The component
//  -------------

//  Component definition.
class Courier extends React.Component {  //  Impure

  //  Constructor.
  constructor (props) {
    super(props);

    //  Function binding.
    const { handleLoadMore } = Object.getPrototypeOf(this);
    this.handleLoadMore = handleLoadMore.bind(this);

    //  We go ahead and prefetch the notifications, forgetting any
    //  previously-loaded ones.  There shouldn't ever be two couriers
    //  on the screen at one time so this shouldn't cause a problem.
    const { '💪': { fetch } } = this.props;
    fetch();
  }

  //  Loads more.
  handleLoadMore () {
    const { '💪': { expand } } = this.props;
    expand();
  }

  //  Rendering.
  render () {
    const { handleLoadMore } = this;
    const {
      className,
      ℳ,
      '🏪': {
        isLoading,
        notifications,
        settings,
      },
      '💪': { expand },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COURIER', className);

    //  We just render our notifications in a `<CommonList>`.  The
    //  `<CommonButton>` at the bottom is just for loading more.
    return (
      <CommonList
        className={computedClass}
        isLoading={isLoading}
        onScrollToBottom={handleLoadMore}
      >
        {notifications ? notifications.reduce(function (items, id) {
          items.push(
            <ConnectedNotification
              hideIf={(settings.getIn(['shows', 'favourite']) && POST_TYPE.IS_FAVOURITE) | (settings.getIn(['shows', 'reblog']) && POST_TYPE.IS_REBLOG) | (settings.getIn(['shows', 'mention']) && POST_TYPE.IS_MENTION) | (settings.getIn(['shows', 'follow']) && POST_TYPE.IS_FOLLOW)}
              id={id}
              key={id}
            />
          );
          return items;
        }, []).concat(!isLoading ? (
          <CommonObserveäble
            key='loadmore'
            searchText={ℳ.loadMore}
          >
            <CommonButton
              onClick={expand}
              showTitle
              title={ℳ.loadMore}
            />
          </CommonObserveäble>
        ) : null) : null}
      </CommonList>
    );
  }

}

//  Props.
Courier.propTypes = {
  className: PropTypes.string,
  rehash: PropTypes.func,
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({
    isLoading: PropTypes.bool,  //  `true` if the courier is still loading
    notifications: ImmutablePropTypes.list,  //  A list of notifications
    settings: ImmutablePropTypes.map,  //  The courier settings
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
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
  defineMessages({
    loadMore: {
      defaultMessage: 'Load more',
      description: 'Label for the "load more" button on couriers',
      id: 'courier.load_more',
    },
  }),

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

//  Exporting.
export { ConnectedCourier as default };
