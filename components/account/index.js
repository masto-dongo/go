//  <Account>
//  =========

//  * * * * * * *  //

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
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Other imports.
import { RELATIONSHIP } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
const Account = ({
  at,
  className,
  comrade,
  displayName,
  handler,
  history,
  href,
  id,
  intl,
  location,  //  Not updated; don't use
  match,  //  Not updated; don't use
  rainbow,
  relationship,
  size,
  ...rest
}) => {
  const computedClass = classNames('MASTODON_GO--ACCOUNT', { small }, className);
  return (
    <div
      className={computedClass}
      style={rainbow ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('7').join(', ')})` } : {}}
      {...rest}
    >
      <AvatarContainer
        account={id}
        comrade={comrade}
      />
      <CommonLink
        className='info'
        destination={`/profile/${id}`}
        history={history}
        href={href}
      >
        <b>
          <ParserContainer
            text={displayName || '———'}
            type={ParseContainer.Type.EMOJI}
          />
        </b>
        <code>@{at}</code>
      </CommonLink>
      {!small ?
        <CommonButton
          //  TK: relationship following stuff idk
        />
      : null}
    </div>
  );
}

//  Component props.
Account.propTypes = {
  at: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  comrade: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handler: PropTypes.objectOf(PropTypes.func).isRequired,
  history: PropTypes.object,
  href: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  intl: PropTypes.object,
  location: PropTypes.object,  //  Not updated; don't use
  match: PropTypes.object,  //  Not updated; don't use
  rainbow: ImmutablePropTypes.map,
  relationship: PropTypes.number.isRequired,
  small: PropTypes.bool,
};

//  Export.
export default Account;
