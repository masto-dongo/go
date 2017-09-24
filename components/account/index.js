//  <Account>
//  =========

//  * * * * * * *  //

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';

//  Container imports.
import AvatarContainer from 'mastodon-go/components/avatar/container';
import ParserContainer from 'mastodon-go/components/parser/container';

//  Common imports.
import CommonButton from 'mastodon-go/components/common/button';
import CommonLink from 'mastodon-go/components/common/link';

//  Other imports.
import { RELATIONSHIP } from 'mastodon-go/util/constants';

//  * * * * * * *  //

const Account = ({
  at,
  className,
  displayName,
  handler,
  history,
  href,
  id,
  intl,
  location,
  match,
  relationship,
  ...rest
}) => {
  const computedClass = classNames('MASTODON_GO--ACCOUNT', className);
  return (
    <div
      className={computedClass}
      {...rest}
    >
      <AvatarContainer
        account={id}
        className='avatar'
      />
      <CommonLink
        className='info'
        destination={`/profile/${id}`}
        history={history}
        href={href}
      >
        <b className='display_name'>
          <ParserContainer
            text={displayName}
            type={ParserContainer.Type.EMOJI}
          />
        </b>
        <code className='at'>{at}</code>
      </CommonLink>
      <CommonButton
        //  relationship following stuff idk
      />
    </div>
  );
}

Account.propTypes = {
  at: PropTypes.string.isRequired,
  avatar: ImmutablePropTypes.map.isRequired,
  className: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handler: PropTypes.objectOf(PropTypes.func).isRequired,
  history: PropTypes.object,
  href: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  intl: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  relationship: PropTypes.number.isRequired,
};

export default Account;
