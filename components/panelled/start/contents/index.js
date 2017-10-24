//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import {
  CommonButton,
  ConnectedAccount,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function PanelledStartContents ({
  activeRoute,
  className,
  history,
  rehash,
  ℳ,
  '💪': handler,
  '🏪': { me },
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--START', className);

  return (
    <div
      className={computedClass}
      {...rest}
    >
      {me ? (
        <ConnectedAccount
          history={history}
          id={me}
        />
      ) : null}
      <nav>
        <h2>{ℳ.personal}</h2>
        <CommonButton
          destination='/compose'
          history={history}
          icon='pencil-square'
          showTitle
          title={ℳ.drawer}
        />
        <CommonButton
          destination='/courier'
          history={history}
          icon='star-half-o'
          showTitle
          title={ℳ.courier}
        />
        <CommonButton
          href='/settings/preferences'
          icon='cog'
          showTitle
          title={ℳ.preferences}
        />
      </nav>
      <nav>
        <h2>{ℳ.timelines}</h2>
        <CommonButton
          destination='/home'
          history={history}
          icon='home'
          showTitle
          title={ℳ.home}
        />
        <CommonButton
          destination='/global'
          history={history}
          icon='globe'
          showTitle
          title={ℳ.global}
        />
        <CommonButton
          destination='/local'
          history={history}
          icon='users'
          showTitle
          title={ℳ.local}
        />
      </nav>
      <nav>
        <h2>{ℳ.meta}</h2>
        <CommonButton
          href='/about/more'
          icon='book'
          showTitle
          title={ℳ.about}
        />
        <CommonButton
          href='/auth/sign_out'
          icon='sign-out'
          showTitle
          title={ℳ.logout}
        />
      </nav>
    </div>
  );
}

PanelledStartContents.propTypes = {
  activeRoute: PropTypes.bool,
  className: PropTypes.string,
  history: PropTypes.object,
  rehash: PropTypes.func,
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({ me: PropTypes.string }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func),
};
