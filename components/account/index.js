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

//  Container imports.
import {
  AvatarContainer,
  ParseContainer,
} from 'themes/mastodon-go/components';

//  Common imports.
import {
  CommonButton,
  CommonLink,
  CommonObservable,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Other imports.
import {
  POST_TYPE,
  RELATIONSHIP,
} from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function Account ({
  className,
  comrade,
  containerId,
  history,
  id,
  observer,
  small,
  type,
  '🛄': context,
  '💪': handler,
  '🏪': {
    at,
    displayName,
    href,
    me,
    relationship,
  },
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--ACCOUNT', { small }, className);

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
      {...rest}
    >
      <AvatarContainer
        account={id}
        comrade={comrade}
      />
      {
        //  We don't bother with a `<ReferenceContainer>` here since
        //  we already have all of the account info and this lets us
        //  put everything in one link.
        <CommonLink
          className='info'
          destination={`/profile/${id}`}
          history={history}
          href={href}
        >
          <b>
            <ParseContainer
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

//  Props.
Account.propTypes = {
  className: PropTypes.string,
  comrade: PropTypes.string,
  containerId: PropTypes.string,
  history: PropTypes.object,
  id: PropTypes.string.isRequired,
  me: PropTypes.string,
  observer: PropTypes.object,
  small: PropTypes.bool,
  type: PropTypes.number,
  '🛄': PropTypes.shape({}),
  '💪': PropTypes.objectOf(PropTypes.func),
  '🏪': PropTypes.shape({
    at: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    href: PropTypes.string,
    rainbow: ImmutablePropTypes.map,
    relationship: PropTypes.number,
  }).isRequired,
};
