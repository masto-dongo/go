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
const Account = ({
  className,
  comrade,
  containerId,
  history,
  id,
  small,
  type,
  '🛄': { intl },
  '💪': handler,
  '🏪': {
    at,
    displayName,
    href,
    rainbow,
    relationship,
  },
  ...rest
}) => {
  const computedClass = classNames('MASTODON_GO--ACCOUNT', { small }, className);
  return (
    <CommonObservable
      className={computedClass}
      id={containerId || id}
      observer={observer}
      searchText={displayName + '\n@' + at}
      {...rest}
    >
      <div
        className='container'
        style={rainbow ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('7').join(', ')})` } : {}}
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
              type='emoji'
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
    </CommonObservable>
  );
}

//  Component props.
Account.propTypes = {
  className: PropTypes.string,
  comrade: PropTypes.string,
  containerId: PropTypes.string,
  history: PropTypes.object,
  id: PropTypes.string.isRequired,
  small: PropTypes.bool,
  type: PropTypes.number,
  '🛄': PropTypes.shape({ intl: PropTypes.object }),
  '💪': PropTypes.objectOf(PropTypes.func),
  '🏪': PropTypes.shape({
    at: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    href: PropTypes.string,
    rainbow: ImmutablePropTypes.map,
    relationship: PropTypes.number,
  }).isRequired,
};

//  Export.
export default Account;
