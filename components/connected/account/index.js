/*********************************************************************\
|                                                                     |
|   <Account>                                                         |
|   =========                                                         |
|                                                                     |
|   <Account> presents accounts as list items—see <Profile> for the   |
|   column component.  This component is used inside catalogues and   |
|   also at the top of statuses (via a `small` variant).  Regarding   |
|   our other props:                                                  |
|                                                                     |
|   `comrade` gives an associated account whose avatar will then be   |
|   overlaid above this one's—see <CommonAvatar> for more regarding   |
|   that.  `observer` provides us with an Observer which we pass to   |
|   our `<CommonObservable>`—see that component for more info there   |
|   as well.  `containerId` gives us the `id` used by the account's   |
|   container if it differs from the account's—this is the case for   |
|   notifications.                                                    |
|                                                                     |
|   Aside from the account's `id`, `type` is the only other prop we   |
|   use directly.  This is a `POST_TYPE` constant, which is used to   |
|   generate the interaction button (eg, "block", "follow", "mute")   |
|   for the account.  A follow notification should provide you with   |
|   an option to follow back, but this wouldn't be appropriate on a   |
|   catalogue of blocks or mutes.  So we check for that here.         |
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

//  Request imports.
import {
  authorizeRelationship,
  blockRelationship,
  followRelationship,
  muteRelationship,
  rejectRelationship,
  unblockRelationship,
  unfollowRelationship,
  unmuteRelationship,
} from 'themes/mastodon-go/redux';

//  DOM imports.
import { DOMEventNavigate } from 'themes/mastodon-go/DOM';

//  Component imports.
import {
  CommonButton,
  CommonLink,
  CommonObservable,
  ConnectedAvatar,
  ConnectedParse,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import {
  POST_TYPE,
  RELATIONSHIP,
} from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class Account extends React.Component {  //  Impure

  constructor (props) {
    super(props);

    //  Function binding.
    const { handleClick } = Object.getPrototypeOf(this);
    this.handleClick = handleClick.bind(this);
  }

  handleClick () {
    const { id } = this.props;
    DOMEventNavigate(`/profile/${id}`);
  }

  render () {
    const { handleClick } = this;
    const {
      className,
      comrade,
      containerId,
      id,
      observer,
      small,
      type,
      ℳ,
      '🏪': {
        at,
        displayName,
        href,
        me,
        relationship,
      },
      '💪': handler,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--ACCOUNT', { small }, className);

    //  Rendering.
    return (

      //  We render our component inside of a `<CommonObservable>` in
      //  case it appears inside of a list.  If `observer` is `null` then
      //  this won't do anything.
      <CommonObservable
        className={computedClass}
        id={containerId || id}
        observer={observer}
        searchText={displayName + '\n@' + at}
      >
        <ConnectedAvatar
          account={id}
          comrade={comrade}
        />
        {
          //  We don't bother with a `<Reference>` here because we
          //  already have all of the account info and this lets us put
          //  everything in one link.
          <CommonLink
            className='info'
            href={href}
            onClick={handleClick}
          >
            <b>
              <ConnectedParse
                text={displayName || '———'}
                type='emoji'
              />
            </b>
            <code>@{at}</code>
          </CommonLink>
        }
        {
          //  This function gets our interaction button for use with the
          //  account.  We don't show this on `small` accounts (which
          //  appear in status headers) or if we aren't provided a `type`
          //  and `relationship`.
          !small && type && isFinite(relationship) && id !== me ? function () {
            switch (type) {
            default:
              return null;
            }
          }() : null
        }
      </CommonObservable>
    );
  }

}

//  Props.
Account.propTypes = {
  className: PropTypes.string,
  comrade: PropTypes.string,
  containerId: PropTypes.string,
  id: PropTypes.string.isRequired,
  me: PropTypes.string,
  observer: PropTypes.object,
  small: PropTypes.bool,
  type: PropTypes.number,
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    at: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    href: PropTypes.string,
    rainbow: ImmutablePropTypes.map,
    relationship: PropTypes.number,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func),
};

//  * * * * * * *  //

//  Connecting
//  ----------

var ConnectedAccount = connect(

  //  Component
  Account,

  //  Store
  createStructuredSelector({
    at: (state, { id }) => state.getIn(['account', id, 'at']),
    displayName: (state, { id }) => state.getIn(['account', id, 'displayName']),
    href: (state, { id }) => state.getIn(['account', id, 'href']),
    me: state => state.getIn(['meta', 'me']),
    relationship: (state, { id }) => state.getIn(['relationship', id]),
  }),

  //  Messages
  null,

  //  Handler
  (go, store, { id }) => ({
    authorize: (newId = id) => go(authorizeRelationship, newId),
    block: (newId = id) => go(blockRelationship, newId),
    follow: (newId = id) => go(followRelationship, newId),
    mute: (newId = id) => go(muteRelationship, newId),
    reject: (newId = id) => go(rejectRelationship, newId),
    unblock: (newId = id) => go(unblockRelationship, newId),
    unfollow: (newId = id) => go(unfollowRelationship, newId),
    unmute: (newId = id) => go(unmuteRelationship, newId),
  })
);

export { ConnectedAccount as default };
