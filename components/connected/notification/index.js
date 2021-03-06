//  <ConnectedNotification>
//  =======================

//  A notification is more-or-less just a wrapper for an account or
//  status for inclusion inside of a courier.  Note that notifications
//  have their own ids (distinct from status or account ids).  Their
//  `POST_TYPE` can be used for hiding/filtering when the `hideIf` prop
//  is specified.  Be careful not to specify a `hideIf` like the
//  following:

//      var hideIf = POST_TYPE.FOLLOW | POST_TYPE.FAVOURITE;

//  …because that code is equivalent to:

//      var hideIf = POST_TYPE.IS_FOLLOW | POST_TYPE.IS_FAVOURITE |
//        POST_TYPE.STATUS | POST_TYPE.PLAIN;

//  …which will hide all notifications.  Instead, you should write:

//      var hideIf = POST_TYPE.IS_FOLLOW | POST_TYPE.IS_FAVOURITE;

//  …which just hides follows and favourites.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  ConnectedAccount,
  ConnectedStatus,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import { POST_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
function Notification ({
  className,
  hideIf,
  id,
  observer,
  '🏪': {
    account,
    status,
    type,
  },
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--NOTIFICATION', className);

  //  We don't show the notification if its `type` matches any part of
  //  `hideIf`.
  if (hideIf & type) {
    return null;
  }

  //  If our notification contains a status, then we render a <Status>.
  if (type & POST_TYPE.STATUS) {
    return (
      <ConnectedStatus
        className={computedClass}
        comrade={account}
        containerId={id}
        id={status}
        observer={observer}
        type={type}
      />
    );
  }

  //  Otherwise, we render an <Account>.
  return (
    <ConnectedAccount
      className={computedClass}
      containerId={id}
      id={account}
      observer={observer}
      type={type}
    />
  );
}

//  Props.
Notification.propTypes = {
  className: PropTypes.string,
  hideIf: PropTypes.number,  //  Specifies `POST_TYPE`s to hide
  id: PropTypes.string.isRequired,
  observer: PropTypes.object,  //  An `observer` for tracking intersections
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    account: PropTypes.string.isRequired,  //  The id of the account associated with the notification
    status: PropTypes.string,  //  The id of the status associated with the notification
    type: PropTypes.number.isRequired,  //  The notification's `POST_TYPE`
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func),
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
var ConnectedNotificaton = connect(

  //  Component.
  Notification,

  //  Store.
  createStructuredSelector({
    account: (state, { id }) => state.getIn(['notification', id, 'account']),
    datetime: (state, { id }) => state.getIn(['notification', id, 'datetime']),
    status: (state, { id }) => state.getIn(['notification', id, 'status']),
    type: (state, { id }) => state.getIn(['notification', id, 'type']),
  })
);

//  Exporting.
export { ConnectedNotificaton as default };
